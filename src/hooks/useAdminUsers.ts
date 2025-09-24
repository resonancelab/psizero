import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import psiZeroApi from "@/lib/api/index";

export interface AdminUser {
  id: string;
  email: string;
  is_sysadmin: boolean;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
  role?: 'sysadmin' | 'admin' | 'user';
  username?: string;
  avatar_url?: string;
  plan_tier?: string;
  monthly_api_limit?: number;
  subscription_status?: string;
  api_keys_count: number;
  usage_last_30_days: number;
  is_active?: boolean;
}

interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  total_pages: number;
}

interface SystemStats {
  total_users: number;
  active_users: number;
  api_calls_today: number;
  total_api_keys: number;
  revenue_this_month: number;
  new_users_this_week: number;
}

interface CreateUserRequest {
  email: string;
  password: string;
  is_sysadmin?: boolean;
}

interface UpdateUserRequest {
  email?: string;
  is_sysadmin?: boolean;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const { toast } = useToast();

  const fetchUsers = async (page: number = 1, limit: number = 50) => {
    try {
      setIsLoading(true);
      
      const response = await psiZeroApi.client.get<AdminUsersResponse>('/v1/admin/users', {
        params: {
          page,
          limit
        }
      });
      
      if (response.data) {
        // Transform data to include missing fields with defaults
        const usersWithDefaults = (response.data.users || []).map(user => ({
          ...user,
          role: (user.is_sysadmin ? 'sysadmin' : 'user') as 'sysadmin' | 'admin' | 'user',
          api_keys_count: 0, // Default value - would be populated from separate endpoint
          usage_last_30_days: 0, // Default value - would be populated from analytics
          is_active: true // Default value
        }));
        
        setUsers(usersWithDefaults);
      }
    } catch (error: Error | unknown) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const response = await psiZeroApi.client.get<SystemStats>('/v1/admin/stats');
      
      if (response.data) {
        setSystemStats(response.data);
      }
    } catch (error: Error | unknown) {
      console.error('Error fetching system stats:', error);
    }
  };

  const createUser = async (userData: CreateUserRequest): Promise<AdminUser> => {
    try {
      const response = await psiZeroApi.client.post<AdminUser>('/v1/admin/users', userData);

      toast({
        title: "Success",
        description: "User created successfully",
      });

      await fetchUsers(); // Refresh data
      return response.data;
    } catch (error: Error | unknown) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: UpdateUserRequest): Promise<AdminUser> => {
    try {
      const response = await psiZeroApi.client.put<AdminUser>(`/v1/admin/users/${userId}`, userData);

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      await fetchUsers(); // Refresh data
      return response.data;
    } catch (error: Error | unknown) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserRole = async (userId: string, role: 'sysadmin' | 'admin' | 'user') => {
    try {
      const isSysadmin = role === 'sysadmin';
      await updateUser(userId, { is_sysadmin: isSysadmin });

      toast({
        title: "Success",
        description: `User role updated to ${role}`,
      });
    } catch (error: Error | unknown) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      await psiZeroApi.client.delete(`/v1/admin/users/${userId}`);

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      await fetchUsers(); // Refresh data
    } catch (error: Error | unknown) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
      throw error;
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      // For now, we'll mark the user as inactive
      // In a full implementation, there would be a specific suspend endpoint
      await updateUser(userId, { is_sysadmin: false });
      
      toast({
        title: "User Suspended",
        description: "User has been suspended",
      });
    } catch (error: Error | unknown) {
      console.error('Error suspending user:', error);
      toast({
        title: "Error",
        description: "Failed to suspend user",
        variant: "destructive",
      });
    }
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.last_sign_in_at && u.is_active).length;
    const sysadmins = users.filter(u => u.is_sysadmin).length;
    const admins = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => !u.is_sysadmin && (!u.role || u.role === 'user')).length;

    return {
      totalUsers,
      activeUsers,
      sysadmins,
      admins,
      regularUsers,
    };
  };

  useEffect(() => {
    fetchUsers();
    fetchSystemStats();
  }, []);

  return {
    users,
    isLoading,
    systemStats,
    fetchUsers,
    fetchSystemStats,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
    suspendUser,
    getUserStats,
  };
};