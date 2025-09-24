import React from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { EngineSearchFilters, EngineStatus } from '@/types/sai';
import { format } from 'date-fns';

interface EngineFiltersProps {
  filters: EngineSearchFilters;
  onFiltersChange: (filters: Partial<EngineSearchFilters>) => void;
  onClearFilters: () => void;
}

const EngineFilters: React.FC<EngineFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleStatusChange = (status: string) => {
    if (status === 'all') {
      onFiltersChange({ status: undefined });
    } else {
      onFiltersChange({ status: [status as EngineStatus] });
    }
  };

  const handleDateRangeChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (!date) return;

    const currentRange = filters.dateRange || { start: new Date(), end: new Date() };
    
    if (type === 'start') {
      onFiltersChange({
        dateRange: { ...currentRange, start: date }
      });
    } else {
      onFiltersChange({
        dateRange: { ...currentRange, end: date }
      });
    }
  };

  const clearDateRange = () => {
    onFiltersChange({ dateRange: undefined });
  };

  const hasActiveFilters = Boolean(
    filters.status?.length ||
    filters.name ||
    filters.dateRange ||
    filters.hasTrainingHistory !== undefined
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Filter Engines</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Status</Label>
          <Select
            value={filters.status?.[0] || 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Created Date</Label>
          <div className="flex gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 flex-1 justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-3 w-3" />
                  {filters.dateRange?.start ? (
                    format(filters.dateRange.start, 'MMM dd')
                  ) : (
                    <span className="text-gray-500">From</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.dateRange?.start}
                  onSelect={(date) => handleDateRangeChange('start', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 flex-1 justify-start text-left font-normal"
                >
                  {filters.dateRange?.end ? (
                    format(filters.dateRange.end, 'MMM dd')
                  ) : (
                    <span className="text-gray-500">To</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.dateRange?.end}
                  onSelect={(date) => handleDateRangeChange('end', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {filters.dateRange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateRange}
                className="h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Training History Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Training History</Label>
          <Select
            value={
              filters.hasTrainingHistory === undefined 
                ? 'all' 
                : filters.hasTrainingHistory 
                  ? 'yes' 
                  : 'no'
            }
            onValueChange={(value) => {
              if (value === 'all') {
                onFiltersChange({ hasTrainingHistory: undefined });
              } else {
                onFiltersChange({ hasTrainingHistory: value === 'yes' });
              }
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Engines</SelectItem>
              <SelectItem value="yes">With History</SelectItem>
              <SelectItem value="no">No History</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Filters Placeholder */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Advanced</Label>
          <div className="flex items-center space-x-2 h-8">
            <span className="text-xs text-gray-500">More filters coming soon</span>
          </div>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <span className="text-xs text-gray-600">Quick filters:</span>
        
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => handleStatusChange('running')}
        >
          Currently Training
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => onFiltersChange({ hasTrainingHistory: true })}
        >
          Has Training History
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            onFiltersChange({
              dateRange: { start: lastWeek, end: new Date() }
            });
          }}
        >
          Created This Week
        </Button>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {[
                filters.status?.length && `Status: ${filters.status.join(', ')}`,
                filters.name && `Name: "${filters.name}"`,
                filters.dateRange && 'Date range selected',
                filters.hasTrainingHistory !== undefined && 
                  `Training: ${filters.hasTrainingHistory ? 'With history' : 'No history'}`
              ].filter(Boolean).join(' • ')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-blue-600 hover:text-blue-700 h-6"
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineFilters;