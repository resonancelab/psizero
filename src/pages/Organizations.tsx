import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateOrganizationDialog } from "@/components/CreateOrganizationDialog";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { Building, Settings, Users, Plus } from "lucide-react";

export default function Organizations() {
  const { organizations, currentOrganization, isLoading } = useOrganizationContext();

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-2">Manage your organizations and team members</p>
        </div>
        
        <div className="space-y-6">
        {/* Current Organization Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <OrganizationSwitcher />
            {currentOrganization && (
              <div className="text-sm text-muted-foreground">
                Your role: <Badge variant="secondary" className="capitalize">{currentOrganization.role}</Badge>
              </div>
            )}
          </div>
          <CreateOrganizationDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Organization
            </Button>
          </CreateOrganizationDialog>
        </div>

        {/* Current Organization Details */}
        {currentOrganization && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>{currentOrganization.name}</span>
              </CardTitle>
              <CardDescription>
                {currentOrganization.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Slug</Badge>
                  <span className="font-mono text-sm">{currentOrganization.slug}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Role</Badge>
                  <span className="capitalize">{currentOrganization.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Status</Badge>
                  <span>{currentOrganization.is_active ? "Active" : "Inactive"}</span>
                </div>
              </div>
              
              {(currentOrganization.role === 'owner' || currentOrganization.role === 'admin') && (
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Members
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Organizations */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Organizations</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : organizations.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No organizations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first organization to get started with team collaboration.
                </p>
                <CreateOrganizationDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Organization
                  </Button>
                </CreateOrganizationDialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizations.map((org) => (
                <Card key={org.id} className={org.id === currentOrganization?.id ? "ring-2 ring-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{org.name}</span>
                      <Badge variant="secondary" className="capitalize">
                        {org.role}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {org.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-muted-foreground">
                        /{org.slug}
                      </span>
                      <Badge variant={org.is_active ? "default" : "secondary"}>
                        {org.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </PageLayout>
  );
}