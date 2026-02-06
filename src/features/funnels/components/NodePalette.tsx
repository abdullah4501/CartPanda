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
        "flex items-center gap-3 p-3 rounded-md border border-white/10 bg-white/5 cursor-grab active:cursor-grabbing transition-all duration-200",
        "hover:bg-white/10 hover:border-white/20 group relative overflow-hidden"
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
      <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-primary/50 transition-colors" />
      <DragHandleDots2Icon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
      <div className="p-2 rounded-md bg-black/20 group-hover:bg-black/40 transition-colors">
        <Icon className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-100 truncate group-hover:text-white transition-colors">{config.label}</p>
        <p className="text-[10px] text-slate-400 truncate group-hover:text-slate-300 transition-colors uppercase tracking-wide opacity-80">{config.description}</p>
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
