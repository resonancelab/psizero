import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import psiZeroApi from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { User, AuthResponse, AuthTokens, ValidationResponse, RefreshResponse } from '@/lib/api/types';

export type UserRole = 'sysadmin' | 'admin' | 'user' | null;

interface AuthContextType {
  user: User | null;
  session: AuthResponse | null;
  userRole: UserRole;
  isSysadmin: boolean;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null | undefined }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null | undefined }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null | undefined }>;
  setSysadminStatus: (userId: string, isSysadmin: boolean) => Promise<{ success: boolean; error?: string | null | undefined }>;
  refreshToken: () => Promise<void>;
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'psizero_access_token';
const REFRESH_TOKEN_KEY = 'psizero_refresh_token';
const USER_DATA_KEY = 'psizero_user_data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const { toast } = useToast();

  const fetchUserRole = async (user: User): Promise<UserRole> => {
    // Add null/undefined checking for user object
    if (!user) {
      console.error('fetchUserRole: user object is undefined or null');
      return 'user';
    }
    
    // Check if user has sysadmin privileges
    // Use the computed is_sysadmin field from backend, or fallback to plan logic
    if (user.is_sysadmin === true) {
      return 'sysadmin';
    }
    
    // Check for other admin roles (can be expanded later)
    if (user.plan === 'enterprise') {
      return 'admin';
    }
    
    return 'user';
  };

  // Store tokens securely
  const storeTokens = (tokens: AuthTokens) => {
    if (tokens.access_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    }
    if (tokens.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    }
  };

  // Clear stored tokens
  const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  };

  // Get stored tokens
  const getStoredTokens = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    return { accessToken, refreshToken };
  };

  // Validate current session with backend
  const validateSession = async () => {
    const { accessToken, refreshToken: storedRefreshToken } = getStoredTokens();
    
    console.log('🔍 [validateSession] Starting session validation:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!storedRefreshToken,
      accessTokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'null',
      currentApiClientKey: psiZeroApi.client.getApiKey() ? `${psiZeroApi.client.getApiKey()?.substring(0, 20)}...` : 'null'
    });
    
    if (!accessToken) {
      console.log('🔍 [validateSession] No access token found, returning false');
      return false;
    }

    try {
      // FIXED: Use JWT token method instead of API key method
      console.log('🎫 [validateSession] Setting JWT token for session auth...');
      const previousJwtToken = psiZeroApi.client.getJwtToken();
      psiZeroApi.client.setJwtToken(accessToken);
      console.log('🔄 [validateSession] JWT token updated:', {
        previous: previousJwtToken ? `${previousJwtToken.substring(0, 20)}...` : 'null',
        new: `${accessToken.substring(0, 20)}...`,
        apiKeyStillPresent: !!psiZeroApi.client.getApiKey()
      });
      
      // Use the proper token validation endpoint
      console.log('🌐 [validateSession] Making validation request to /auth/validate...');
      const response = await psiZeroApi.client.get('/auth/validate');
      
      if (response.status === 200 && response.data) {
        // Token is valid, restore user data from response
        const responseData = response.data as ValidationResponse;
        
        if (responseData.user) {
          const user = responseData.user;
          setUser(user);
          const role = await fetchUserRole(user);
          setUserRole(role);
          setSession({ user, tokens: { access_token: accessToken } });
          
          // Update stored user data
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
          return true;
        }
      } else if (response.status === 401 && storedRefreshToken) {
        // Access token expired, try to refresh
        try {
          const refreshResponse = await psiZeroApi.client.post('/auth/refresh', {
            refresh_token: storedRefreshToken
          });

          if (refreshResponse.status === 200 && refreshResponse.data) {
            const responseData = refreshResponse.data as { user: User; tokens: AuthTokens };
            if (responseData.user && responseData.tokens) {
              const { user, tokens } = responseData;
              
              // Update state
              setUser(user);
              const role = await fetchUserRole(user);
              setUserRole(role);
              setSession({ user, tokens });

              // Store new tokens
              storeTokens(tokens);
              localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
              psiZeroApi.client.setJwtToken(tokens.access_token);
              
              return true;
            }
          }
          
          clearTokens();
          return false;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          clearTokens();
          return false;
        }
      } else if (response.status === 429) {
        // Rate limited - don't clear tokens, just return false for now
        console.warn('Authentication rate limited, retrying later...');
        return false;
      }
      
      // Token is invalid and refresh failed/unavailable, clear everything
      clearTokens();
      return false;
    } catch (error) {
      // Check if it's a rate limit error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('429')) {
        console.warn('Authentication rate limited, retrying later...');
        return false;
      }
      
      console.error('Session validation failed:', error);
      clearTokens();
      return false;
    }
  };

  // Refresh access token
  const refreshToken = async () => {
    const { refreshToken: storedRefreshToken } = getStoredTokens();
    
    if (!storedRefreshToken) {
      await signOut();
      return;
    }

    try {
      const response = await psiZeroApi.client.post('/auth/refresh', {
        refresh_token: storedRefreshToken
      });

      if (response.status === 200 && response.data) {
        const responseData = response.data as RefreshResponse;
        if (responseData.user && responseData.tokens) {
          const { user, tokens } = responseData;
          
          // Update state
          setUser(user);
          const role = await fetchUserRole(user);
          setUserRole(role);
          setSession({ user, tokens });

          // Store new tokens
          storeTokens(tokens);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
          psiZeroApi.client.setJwtToken(tokens.access_token);
          
          return;
        }
      }
      
      // Refresh failed, sign out
      await signOut();
    } catch (error) {
      console.error('Token refresh failed:', error);
      await signOut();
    }
  };

  // This function would now be handled by the backend
  const setSysadminStatus = async (userId: string, isSysadmin: boolean) => {
    console.warn("setSysadminStatus is a backend operation and should not be called from the client in this new auth model.");
    return { success: false, error: "Operation not permitted." };
  };

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = async () => {
      // Prevent multiple simultaneous initializations
      if (initializing) return;
      
      setInitializing(true);
      setLoading(true);
      
      try {
        await validateSession();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        clearTokens();
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string) => {
    const response = await psiZeroApi.auth.register({ email, password });
    
    if (response.error || !response.data) {
      toast({
        title: "Sign up failed",
        description: response.error || "An unknown error occurred.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created",
        description: "You can now sign in.",
      });
    }
    
    return { error: response.error };
  };

  const signIn = async (email: string, password: string) => {
    const response = await psiZeroApi.auth.login({ email, password });

    if (response.error || !response.data) {
      toast({
        title: "Sign in failed",
        description: response.error || "Invalid credentials.",
        variant: "destructive",
      });
      return { error: response.error || "Invalid credentials." };
    }

    // Add safety checks for response structure
    const { user, tokens } = response.data;
    
    if (!user) {
      console.error('signIn: user object is missing from response.data', response.data);
      toast({
        title: "Sign in failed",
        description: "Invalid response format from server.",
        variant: "destructive",
      });
      return { error: "Invalid response format from server." };
    }
    
    if (!tokens) {
      console.error('signIn: tokens object is missing from response.data', response.data);
      toast({
        title: "Sign in failed",
        description: "Authentication tokens missing from server response.",
        variant: "destructive",
      });
      return { error: "Authentication tokens missing from server response." };
    }

    setSession(response.data);
    setUser(user);
    const role = await fetchUserRole(user);
    setUserRole(role);

    // Store tokens and user data securely
    if (tokens && tokens.access_token) {
      storeTokens(tokens);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      psiZeroApi.client.setJwtToken(tokens.access_token);
    }

    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setUserRole(null);
    clearTokens();
    psiZeroApi.client.clearJwtToken();
    
    // Optional: Call backend logout endpoint if it exists
    try {
      await psiZeroApi.client.post('/auth/logout', {});
    } catch (error) {
      console.log('Logout endpoint not available:', error);
    }
  };

  // This would need a corresponding backend endpoint
  const resetPassword = async (email: string) => {
    console.warn("resetPassword is not yet implemented in the backend.");
    toast({
      title: "Feature not available",
      description: "Password reset is not yet implemented.",
    });
    return { error: "Not implemented." };
  };

  const value = {
    user,
    session,
    userRole,
    isSysadmin: userRole === 'sysadmin',
    isAdmin: userRole === 'admin' || userRole === 'sysadmin',
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    setSysadminStatus,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};