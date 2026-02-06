import { memo } from "react";
import { ViewVerticalIcon, Cross1Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { NodePalette } from "@/features/funnels/components/NodePalette";
import { ValidationPanel } from "@/features/funnels/components/ValidationPanel";
import { ValidationIssue } from "@/features/funnels/types/funnel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNodeClick?: (nodeId: string) => void;
}

import { useFunnelStore } from "@/features/funnels/hooks/useFunnelStore";

export const Sidebar = memo(
  ({ isOpen, onToggle, onNodeClick }: SidebarProps) => {
    const validateFunnel = useFunnelStore((state) => state.validateFunnel);
    const nodes = useFunnelStore((state) => state.nodes);
    const edges = useFunnelStore((state) => state.edges);

    // Calculate validation issues when nodes/edges change
    const validationIssues = validateFunnel();

    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "fixed top-4 left-4 z-50 lg:hidden shadow-md bg-background",
            isOpen && "hidden"
          )}
          onClick={onToggle}
          aria-label="Open sidebar"
        >
          <ViewVerticalIcon className="h-4 w-4" />
        </Button>

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
            "flex flex-col shadow-xl lg:shadow-none",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0 lg:static"
          )}
          role="complementary"
          aria-label="Funnel builder sidebar"
        >
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-14">
            <div>
              <h1 className="text-sm font-bold text-sidebar-foreground uppercase tracking-widest">
                Funnel Builder
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={onToggle}
              aria-label="Close sidebar"
            >
              <Cross1Icon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            <NodePalette />

            <Separator className="bg-sidebar-border" />

            <ValidationPanel
              issues={validationIssues}
              onNodeClick={onNodeClick}
            />
          </div>

          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/20">
            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider">
              Cartpanda Funnel System
            </p>
          </div>
        </aside>

        {isOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={onToggle}
            aria-hidden="true"
          />
        )}
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";
