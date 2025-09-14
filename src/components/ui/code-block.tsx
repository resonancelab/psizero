import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showCopy?: boolean;
  className?: string;
}

const CodeBlock = ({ 
  code, 
  language, 
  title, 
  showCopy = true, 
  className 
}: CodeBlockProps) => {
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <div className={`bg-api-code-bg rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-api-code-text">
          {title || language}
        </span>
        {showCopy && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => copyToClipboard(code, "Code copied to clipboard")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
      <pre className="text-sm text-api-code-text overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;