import { memo } from "react";
import {
  ExclamationTriangleIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { ValidationIssue } from "@/features/funnels/types/funnel";

interface ValidationPanelProps {
  issues: ValidationIssue[];
  onNodeClick?: (nodeId: string) => void;
}

export const ValidationPanel = memo(
  ({ issues, onNodeClick }: ValidationPanelProps) => {
    const errors = issues.filter((i) => i.type === "error");
    const warnings = issues.filter((i) => i.type === "warning");

    if (issues.length === 0) {
      return (
        <div className="flex items-center gap-2 p-3 rounded-md bg-success/10 text-success border border-success/20">
          <CheckCircledIcon className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-medium">All systems operational</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <ExclamationTriangleIcon className="w-3.5 h-3.5 text-warning" />
          <h3 className="text-sm font-semibold text-sidebar-foreground">
            Issues ({issues.length})
          </h3>
        </div>

        <div className="space-y-1.5 max-h-[200px] overflow-y-auto custom-scrollbar">
          {errors.map((issue, index) => (
            <button
              key={`error-${index}`}
              className={cn(
                "w-full flex items-start gap-2 p-2 rounded-md text-left text-sm transition-colors",
                "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
                issue.nodeId && "cursor-pointer"
              )}
              onClick={() => issue.nodeId && onNodeClick?.(issue.nodeId)}
              aria-label={issue.nodeId ? `Go to node: ${issue.message}` : undefined}
            >
              <CrossCircledIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{issue.message}</span>
            </button>
          ))}

          {warnings.map((issue, index) => (
            <button
              key={`warning-${index}`}
              className={cn(
                "w-full flex items-start gap-2 p-2 rounded-md text-left text-sm transition-colors",
                "bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20",
                issue.nodeId && "cursor-pointer"
              )}
              onClick={() => issue.nodeId && onNodeClick?.(issue.nodeId)}
              aria-label={issue.nodeId ? `Go to node: ${issue.message}` : undefined}
            >
              <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{issue.message}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

ValidationPanel.displayName = "ValidationPanel";
