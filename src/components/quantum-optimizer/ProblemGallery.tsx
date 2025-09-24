import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings,
  MapPin,
  Key,
  Network,
  GitBranch,
  Timer,
  ChevronRight
} from "lucide-react";

export interface OptimizationProblem {
  id: string;
  name: string;
  description: string;
  type: 'tsp' | 'subset_sum' | 'clique' | '3sat' | 'hamiltonian_path' | 'vertex_cover';
  complexity: 'NP-Complete' | 'NP-Hard';
  realWorldApplications: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: string;
}

interface ProblemGalleryProps {
  problems: OptimizationProblem[];
  selectedProblem?: OptimizationProblem | null;
  onProblemSelect: (problem: OptimizationProblem) => void;
  onSolveProblem?: (problem: OptimizationProblem) => void;
  isOptimizing?: boolean;
  className?: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'Advanced': return 'bg-orange-100 text-orange-800';
    case 'Expert': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ProblemGallery: React.FC<ProblemGalleryProps> = ({
  problems,
  selectedProblem,
  onProblemSelect,
  onSolveProblem,
  isOptimizing = false,
  className = ""
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Problem Gallery
        </CardTitle>
        <CardDescription>
          Select an NP-Complete problem to solve with quantum algorithms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {problems.map((problem) => {
          const Icon = problem.icon;
          const isSelected = selectedProblem?.id === problem.id;
          
          return (
            <div
              key={problem.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => onProblemSelect(problem)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    isSelected ? 'text-white' : problem.color
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1">{problem.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{problem.description}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {problem.complexity}
                    </Badge>
                    <Badge className={getDifficultyColor(problem.difficulty) + " text-xs"}>
                      {problem.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <Timer className="h-3 w-3" />
                    {problem.estimatedTime}
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 space-y-2">
                      <div>
                        <h5 className="text-xs font-medium mb-1">Applications:</h5>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {problem.realWorldApplications.slice(0, 2).map((app, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <ChevronRight className="h-2 w-2" />
                              {app}
                            </li>
                          ))}
                          {problem.realWorldApplications.length > 2 && (
                            <li className="text-xs text-gray-500">
                              +{problem.realWorldApplications.length - 2} more...
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {onSolveProblem && (
                        <Button 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSolveProblem(problem);
                          }}
                          disabled={isOptimizing}
                        >
                          {isOptimizing ? 'Solving...' : 'Solve Problem'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ProblemGallery;