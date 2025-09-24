/**
 * Export Dialog Component
 * Provides user interface for exporting optimization problems and solutions
 */

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileDown, 
  Settings, 
  Check, 
  AlertCircle,
  FileText,
  Database,
  Package,
  Zap,
  Clock,
  HardDrive
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { 
  ProblemExporter, 
  SolutionExporter, 
  ExportUtils,
  type ExportOptions,
  type ExportResult
} from '@/lib/quantum-optimizer/export-utils';

import type {
  OptimizationProblem,
  OptimizationSolution,
  SolutionQuality
} from '@/lib/quantum-optimizer/types';

interface ExportDialogProps {
  problem?: OptimizationProblem;
  solution?: OptimizationSolution;
  quality?: SolutionQuality;
  problems?: OptimizationProblem[];
  solutions?: Array<{
    solution: OptimizationSolution;
    problem: OptimizationProblem;
    quality?: SolutionQuality;
  }>;
  trigger?: React.ReactNode;
  onExportComplete?: (result: ExportResult) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  problem,
  solution,
  quality,
  problems = [],
  solutions = [],
  trigger,
  onExportComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportType, setExportType] = useState<'single' | 'multiple' | 'complete'>('single');
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeQuality, setIncludeQuality] = useState(true);
  const [customFilename, setCustomFilename] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);

  // Update estimated size when options change
  React.useEffect(() => {
    if (exportType === 'single' && problem) {
      const data = includeMetadata ? problem : problem;
      setEstimatedSize(ExportUtils.estimateSize(data, format));
    } else if (exportType === 'multiple' && problems.length > 0) {
      setEstimatedSize(ExportUtils.estimateSize(problems, format));
    } else if (exportType === 'complete' && problem && solution) {
      const data = { problem, solution, quality: includeQuality ? quality : undefined };
      setEstimatedSize(ExportUtils.estimateSize(data, format));
    }
  }, [exportType, format, includeMetadata, includeQuality, problem, solution, quality, problems]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getExportTypeOptions = () => {
    const options = [];
    
    if (problem) {
      options.push({ value: 'single', label: 'Single Problem', icon: FileText });
    }
    
    if (problems.length > 0) {
      options.push({ value: 'multiple', label: 'Multiple Problems', icon: Database });
    }
    
    if (problem && solution) {
      options.push({ value: 'complete', label: 'Problem + Solution', icon: Package });
    }

    return options;
  };

  const getFormatIcon = (fmt: string) => {
    switch (fmt) {
      case 'json': return <FileText className="h-4 w-4" />;
      case 'csv': return <Database className="h-4 w-4" />;
      default: return <FileDown className="h-4 w-4" />;
    }
  };

  const generateDefaultFilename = (): string => {
    const timestamp = new Date().toISOString().slice(0, 10);
    
    switch (exportType) {
      case 'single':
        return `problem_${problem?.id || 'unknown'}_${timestamp}`;
      case 'multiple':
        return `problems_collection_${timestamp}`;
      case 'complete':
        return `complete_${problem?.id || 'unknown'}_${timestamp}`;
      default:
        return `export_${timestamp}`;
    }
  };

  const handleExport = useCallback(async () => {
    if (!problem && exportType !== 'multiple') return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const options: ExportOptions = {
        format: format as 'json' | 'csv',
        includeMetadata,
        includeQuality,
        filename: customFilename || generateDefaultFilename()
      };

      let result: ExportResult;

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 20, 80));
      }, 200);

      try {
        switch (exportType) {
          case 'single':
            if (!problem) throw new Error('No problem to export');
            result = await ProblemExporter.exportProblem(problem, options);
            break;
            
          case 'multiple':
            if (problems.length === 0) throw new Error('No problems to export');
            result = await ProblemExporter.exportProblems(problems, options);
            break;
            
          case 'complete':
            if (!problem || !solution) throw new Error('Missing problem or solution');
            result = await ExportUtils.exportComplete(problem, solution, quality, options);
            break;
            
          default:
            throw new Error('Invalid export type');
        }

        clearInterval(progressInterval);
        setExportProgress(100);
      } catch (exportError) {
        clearInterval(progressInterval);
        throw exportError;
      }
      
      setExportResult(result);
      onExportComplete?.(result);
      
      if (result.success) {
        // Auto close dialog after successful export
        setTimeout(() => {
          setIsOpen(false);
          resetDialog();
        }, 2000);
      }
      
    } catch (error) {
      setExportResult({
        success: false,
        filename: '',
        size: 0,
        format,
        error: error instanceof Error ? error.message : 'Export failed'
      });
    } finally {
      setIsExporting(false);
    }
  }, [exportType, format, includeMetadata, includeQuality, customFilename, problem, solution, quality, problems, solutions, onExportComplete]);

  const resetDialog = () => {
    setExportType('single');
    setFormat('json');
    setIncludeMetadata(true);
    setIncludeQuality(true);
    setCustomFilename('');
    setIsExporting(false);
    setExportProgress(0);
    setExportResult(null);
    setEstimatedSize(0);
  };

  const canExport = () => {
    switch (exportType) {
      case 'single': return !!problem;
      case 'multiple': return problems.length > 0;
      case 'complete': return !!problem && !!solution;
      default: return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Export Optimization Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Type</Label>
            <Tabs value={exportType} onValueChange={(value) => setExportType(value as 'single' | 'multiple' | 'complete')}>
              <TabsList className="grid w-full grid-cols-3">
                {getExportTypeOptions().map(({ value, label, icon: Icon }) => (
                  <TabsTrigger key={value} value={value} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="single" className="mt-4">
                <div className="text-sm text-muted-foreground">
                  Export a single optimization problem for analysis or sharing.
                  {problem && (
                    <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium">{problem.name}</div>
                      <div className="text-xs">ID: {problem.id}</div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="multiple" className="mt-4">
                <div className="text-sm text-muted-foreground">
                  Export multiple problems as a collection for batch processing.
                  {problems.length > 0 && (
                    <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium">{problems.length} problems selected</div>
                      <div className="text-xs">Types: {[...new Set(problems.map(p => 'cities' in p ? 'TSP' : 'numbers' in p ? 'SubsetSum' : 'nodes' in p ? 'MaxClique' : '3SAT'))].join(', ')}</div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="complete" className="mt-4">
                <div className="text-sm text-muted-foreground">
                  Export problem, solution, and quality metrics together for complete analysis.
                  {problem && solution && (
                    <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium">{problem.name}</div>
                      <div className="text-xs">Method: {solution.method} | Quality: {quality ? `${(quality.score * 100).toFixed(1)}%` : 'N/A'}</div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as 'json' | 'csv')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON - Structured data format
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    CSV - Spreadsheet compatible
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Export Options</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="include-metadata">Include Metadata</Label>
                <div className="text-xs text-muted-foreground">
                  Include generation timestamps, seeds, and other metadata
                </div>
              </div>
              <Switch
                id="include-metadata"
                checked={includeMetadata}
                onCheckedChange={setIncludeMetadata}
              />
            </div>
            
            {(solution || quality) && (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="include-quality">Include Quality Metrics</Label>
                  <div className="text-xs text-muted-foreground">
                    Include solution quality scores and validation results
                  </div>
                </div>
                <Switch
                  id="include-quality"
                  checked={includeQuality}
                  onCheckedChange={setIncludeQuality}
                />
              </div>
            )}
          </div>

          {/* Custom Filename */}
          <div className="space-y-2">
            <Label htmlFor="filename">Custom Filename (optional)</Label>
            <Input
              id="filename"
              placeholder={generateDefaultFilename()}
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              disabled={isExporting}
            />
          </div>

          {/* File Size Estimate */}
          {estimatedSize > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HardDrive className="h-4 w-4" />
              Estimated size: {formatFileSize(estimatedSize)}
            </div>
          )}

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Exporting...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          )}

          {/* Export Result */}
          {exportResult && (
            <div className={`p-4 rounded-lg border ${exportResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                {exportResult.success ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <div className="flex-1">
                  {exportResult.success ? (
                    <div>
                      <div className="font-medium text-green-800">Export Successful!</div>
                      <div className="text-sm text-green-600">
                        {exportResult.filename} ({formatFileSize(exportResult.size)})
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-red-800">Export Failed</div>
                      <div className="text-sm text-red-600">{exportResult.error}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!canExport() || isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export {format.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;