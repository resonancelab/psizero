/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSAIEngines } from '@/hooks/useSAIEngines';
import { EngineStatus, createDefaultSAIConfig } from '@/types/sai';
import EngineCard from './EngineCard';
import EngineCreationWizard from './EngineCreationWizard';
import EngineDetailView from './EngineDetailView';
import EngineFilters from './EngineFilters';

interface EngineManagementDashboardProps {
  className?: string;
}

type ViewMode = 'grid' | 'list';
type ActiveView = 'dashboard' | 'create' | 'detail';

const EngineManagementDashboard: React.FC<EngineManagementDashboardProps> = ({ className }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    engines,
    loading,
    error,
    stats,
    filters,
    sort,
    pagination,
    loadEngines,
    createEngine,
    updateEngine,
    deleteEngine,
    cloneEngine,
    setFilters,
    setSort,
    setPagination,
    clearFilters,
    startTraining,
    stopTraining,
  } = useSAIEngines({ useMockData: true });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ name: query || undefined });
  };

  // Handle engine creation
  const handleCreateEngine = async (name: string, description?: string) => {
    try {
      const config = createDefaultSAIConfig('user_123', `engine_${Date.now()}`, name);
      await createEngine(config);
      setActiveView('dashboard');
    } catch (error) {
      console.error('Failed to create engine:', error);
    }
  };

  // Handle engine selection
  const handleEngineSelect = (engineId: string) => {
    setSelectedEngineId(engineId);
    setActiveView('detail');
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setFilters({ status: undefined });
    } else {
      setFilters({ status: [status as EngineStatus] });
    }
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    const currentDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ field: field as any, direction: currentDirection });
  };

  const selectedEngine = selectedEngineId ? engines.find(e => e.id === selectedEngineId) : null;

  if (activeView === 'create') {
    return (
      <EngineCreationWizard
        onEngineCreated={handleCreateEngine}
        onCancel={() => setActiveView('dashboard')}
        className={className}
      />
    );
  }

  if (activeView === 'detail' && selectedEngine) {
    return (
      <EngineDetailView
        engine={selectedEngine}
        onBack={() => setActiveView('dashboard')}
        onUpdate={updateEngine}
        onDelete={deleteEngine}
        onClone={cloneEngine}
        onStartTraining={startTraining}
        onStopTraining={stopTraining}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SAI Engine Management</h1>
          <p className="text-muted-foreground">Manage your symbolic AI engines and training sessions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveView('create')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Engine
          </Button>
          <Button
            variant="outline"
            onClick={loadEngines}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Engines</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total_engines}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Grid className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Training</p>
                  <p className="text-2xl font-bold text-foreground">{stats.active_engines}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Idle Engines</p>
                  <p className="text-2xl font-bold text-foreground">{stats.idle_engines}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Grid className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total_users}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search engines by name..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <Select onValueChange={handleStatusFilter} defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="running">Training</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-gray-100' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="border-l pl-2 ml-2">
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <EngineFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          )}
          
          {/* Active Filters */}
          {(filters.status?.length || filters.name || filters.hasTrainingHistory !== undefined) && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filters.status?.map(status => (
                  <Badge key={status} variant="secondary" className="capitalize">
                    Status: {status}
                  </Badge>
                ))}
                {filters.name && (
                  <Badge variant="secondary">
                    Name: {filters.name}
                  </Badge>
                )}
                {filters.hasTrainingHistory !== undefined && (
                  <Badge variant="secondary">
                    Training History: {filters.hasTrainingHistory ? 'Yes' : 'No'}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-700">Error loading engines: {error}</p>
              <Button variant="outline" size="sm" onClick={loadEngines} className="ml-auto">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engines Grid/List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">
            Engines ({pagination.total})
          </h2>
          <div className="flex gap-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSortChange('name')}
              className={sort.field === 'name' ? 'bg-gray-100' : ''}
            >
              Name {sort.field === 'name' && (sort.direction === 'asc' ? '↑' : '↓')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSortChange('last_accessed')}
              className={sort.field === 'last_accessed' ? 'bg-gray-100' : ''}
            >
              Last Accessed {sort.field === 'last_accessed' && (sort.direction === 'asc' ? '↑' : '↓')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSortChange('total_processed_texts')}
              className={sort.field === 'total_processed_texts' ? 'bg-gray-100' : ''}
            >
              Processed {sort.field === 'total_processed_texts' && (sort.direction === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : engines.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Grid className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">No engines found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filters.status?.length || filters.name
                      ? 'Try adjusting your search or filters.'
                      : 'Create your first symbolic AI engine to get started.'
                    }
                  </p>
                </div>
                {(!searchQuery && !filters.status?.length && !filters.name) && (
                  <Button onClick={() => setActiveView('create')} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Engine
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
          }>
            {engines.map((engine) => (
              <EngineCard
                key={engine.id}
                engine={engine}
                viewMode={viewMode}
                onSelect={() => handleEngineSelect(engine.id)}
                onUpdate={updateEngine}
                onDelete={deleteEngine}
                onClone={cloneEngine}
                onStartTraining={startTraining}
                onStopTraining={stopTraining}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex justify-center items-center space-x-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineManagementDashboard;