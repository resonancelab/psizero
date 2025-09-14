import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  role?: 'sysadmin' | 'admin' | 'user';
  username?: string;
  avatar_url?: string;
  plan_tier?: string;
  monthly_api_limit?: number;
  subscription_status?: string;
  api_keys_count: number;
  usage_last_30_days: number;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('get_admin_users');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
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

  const updateUserRole = async (userId: string, role: 'sysadmin' | 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${role}`,
      });

      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      // In a real implementation, you'd have a user status field
      // For now, we'll just show a toast
      toast({
        title: "User Suspended",
        description: "User has been suspended (demo action)",
      });
    } catch (error) {
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
    const activeUsers = users.filter(u => u.last_sign_in_at).length;
    const sysadmins = users.filter(u => u.role === 'sysadmin').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => !u.role || u.role === 'user').length;

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
  }, []);

  return {
    users,
    isLoading,
    fetchUsers,
    updateUserRole,
    suspendUser,
    getUserStats,
  };
};