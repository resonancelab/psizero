import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUsers, AdminUser } from "@/hooks/useAdminUsers";
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  User, 
  Zap,
  Ban,
  Eye,
  Crown
} from "lucide-react";

const UserManagement = () => {
  const { users, isLoading, updateUserRole, suspendUser } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || 
                       (roleFilter === "none" && !user.role) ||
                       user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'sysadmin':
        return <Badge className="bg-destructive/10 text-destructive"><Crown className="h-3 w-3 mr-1" />Sysadmin</Badge>;
      case 'admin':
        return <Badge className="bg-api-warning/10 text-api-warning"><Zap className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'user':
        return <Badge variant="outline"><User className="h-3 w-3 mr-1" />User</Badge>;
      default:
        return <Badge variant="secondary"><User className="h-3 w-3 mr-1" />User</Badge>;
    }
  };

  const getStatusBadge = (user: AdminUser) => {
    if (user.last_sign_in_at) {
      const lastSignIn = new Date(user.last_sign_in_at);
      const daysSinceSignIn = Math.floor((Date.now() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceSignIn <= 7) {
        return <Badge className="bg-api-success/10 text-api-success">Active</Badge>;
      } else if (daysSinceSignIn <= 30) {
        return <Badge className="bg-api-warning/10 text-api-warning">Inactive</Badge>;
      }
    }
    return <Badge variant="outline">Never signed in</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <Badge variant="outline">
          {filteredUsers.length} of {users.length} users
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by email or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="sysadmin">Sysadmin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="none">No Role</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Manage system users and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.email}</span>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Created: {formatDate(user.created_at)}</span>
                        {user.last_sign_in_at && (
                          <span>Last sign in: {formatDate(user.last_sign_in_at)}</span>
                        )}
                        <span>{user.api_keys_count} API keys</span>
                        <span>{user.usage_last_30_days} calls (30d)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    <Select
                      value={user.role || 'user'}
                      onValueChange={(role) => updateUserRole(user.id, role as any)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="sysadmin">Sysadmin</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => suspendUser(user.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {user.plan_tier && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">{user.plan_tier}</Badge>
                      <span className="text-muted-foreground">
                        {user.monthly_api_limit?.toLocaleString()} calls/month
                      </span>
                      <span className="text-muted-foreground">
                        Status: {user.subscription_status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;