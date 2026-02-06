import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  BackpackIcon,
  IdCardIcon,
  DoubleArrowUpIcon,
  DoubleArrowDownIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { FunnelNodeData, NODE_TYPE_CONFIGS } from "@/features/funnels/types/funnel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const iconMap = {
  ShoppingBag: BackpackIcon,
  CreditCard: IdCardIcon,
  TrendingUp: DoubleArrowUpIcon,
  TrendingDown: DoubleArrowDownIcon,
  CheckCircle: CheckCircledIcon,
};

interface FunnelNodeComponentProps {
  id: string;
  data: FunnelNodeData;
  selected?: boolean;
}

export const FunnelNode = memo(({ id, data, selected }: FunnelNodeComponentProps) => {
  const config = NODE_TYPE_CONFIGS[data.nodeType];
  const Icon = iconMap[config.icon as keyof typeof iconMap];

  return (
    <div
      className={cn(
        "relative bg-card rounded-md border shadow-sm transition-all duration-200 min-w-[200px]",
        selected ? "shadow-md border-primary ring-1 ring-primary" : "border-border hover:shadow-md",
        data.hasWarning && !selected && "border-warning"
      )}
      role="button"
      tabIndex={0}
      aria-label={`${data.label} node. ${data.hasWarning ? `Warning: ${data.warningMessage}` : ""}`}
    >
      {data.hasWarning && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute -top-2 -right-2 p-1 bg-warning rounded-full text-warning-foreground z-10 shadow-sm">
              <ExclamationTriangleIcon className="w-3.5 h-3.5" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] text-xs">
            {data.warningMessage}
          </TooltipContent>
        </Tooltip>
      )}

      {/* Monochrome Minimal Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/30 rounded-t-md">
        <div className="p-1 rounded bg-background border border-border">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
          {config.label}
        </span>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-sm text-foreground mb-3">{data.label}</h3>

        <div className="text-xs px-2 py-1.5 rounded bg-secondary text-secondary-foreground text-center font-medium border border-secondary">
          {data.buttonLabel}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-background !border-[1.5px] !border-muted-foreground/50 transition-colors hover:!border-primary hover:!bg-primary"
        aria-label="Connect to this node"
      />
      {config.canHaveOutgoing && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2.5 !h-2.5 !bg-background !border-[1.5px] !border-muted-foreground/50 transition-colors hover:!border-primary hover:!bg-primary"
          aria-label="Connect from this node"
        />
      )}
    </div>
  );
});

FunnelNode.displayName = "FunnelNode";

export const nodeTypes = {
  funnelNode: FunnelNode,
};
