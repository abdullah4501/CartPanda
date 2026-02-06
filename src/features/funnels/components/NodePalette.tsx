import { memo, DragEvent } from "react";
import {
  BackpackIcon,
  IdCardIcon,
  DoubleArrowUpIcon,
  DoubleArrowDownIcon,
  CheckCircledIcon,
  DragHandleDots2Icon, // Replaces GripVertical
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { NodeType, NODE_TYPE_CONFIGS } from "@/features/funnels/types/funnel";

const iconMap = {
  ShoppingBag: BackpackIcon,
  CreditCard: IdCardIcon,
  TrendingUp: DoubleArrowUpIcon,
  TrendingDown: DoubleArrowDownIcon,
  CheckCircle: CheckCircledIcon,
};

interface PaletteItemProps {
  type: NodeType;
}

const PaletteItem = memo(({ type }: PaletteItemProps) => {
  const config = NODE_TYPE_CONFIGS[type];
  const Icon = iconMap[config.icon as keyof typeof iconMap];

  const onDragStart = (event: DragEvent) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-md border border-sidebar-border bg-sidebar-accent/50 cursor-grab active:cursor-grabbing transition-all duration-200",
        "hover:bg-sidebar-accent hover:border-sidebar-primary/50 group"
      )}
      draggable
      onDragStart={onDragStart}
      role="button"
      tabIndex={0}
      aria-label={`Drag ${config.label} to canvas`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          // Could implement keyboard-based node creation here
        }
      }}
    >
      <DragHandleDots2Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      <div className="p-1.5 rounded-sm bg-white/10">
        <Icon className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-sidebar-foreground truncate">{config.label}</p>
        <p className="text-xs text-muted-foreground/70 truncate">{config.description}</p>
      </div>
    </div>
  );
});

PaletteItem.displayName = "PaletteItem";

export const NodePalette = memo(() => {
  const nodeTypes: NodeType[] = [
    "sales",
    "order",
    "upsell",
    "downsell",
    "thankyou",
  ];

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h2 className="text-sm font-semibold text-sidebar-foreground">Tools</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag to add steps
        </p>
      </div>
      <div className="space-y-2">
        {nodeTypes.map((type) => (
          <PaletteItem key={type} type={type} />
        ))}
      </div>
    </div>
  );
});

NodePalette.displayName = "NodePalette";
