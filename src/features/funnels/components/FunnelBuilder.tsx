import { useCallback, useRef, useState, DragEvent } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  useReactFlow,
  Panel,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "@/features/funnels/components/FunnelNode";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar"; // Updated import
import { useFunnelStore } from "@/features/funnels/hooks/useFunnelStore";
import { NodeType, FunnelNodeData } from "@/features/funnels/types/funnel";

// FunnelBuilderInner assumes it is wrapped in ReactFlowProvider (by App.tsx or parent)
export const FunnelBuilder = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView, setCenter } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useFunnelStore();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [screenToFlowPosition, addNode]
  );

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setCenter(node.position.x + 90, node.position.y + 60, {
          zoom: 1.5,
          duration: 500,
        });
      }
    },
    [nodes, setCenter]
  );

  const getNodeColor = useCallback((node: any) => {
    const data = node.data;
    if (!data?.nodeType) return "#64748b";

    const colors: Record<string, string> = {
      sales: "#0d9488",
      order: "#3b82f6",
      upsell: "#22c55e",
      downsell: "#f59e0b",
      thankyou: "#8b5cf6",
    };
    return colors[data.nodeType] || "#64748b";
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-canvas overflow-hidden">
      {/* Top Bar with Toolbar actions */}
      <TopBar />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNodeClick={handleNodeClick}
        />

        <main
          className="flex-1 relative h-full w-full"
          ref={reactFlowWrapper}
          role="main"
          aria-label="Funnel canvas"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            deleteKeyCode={["Backspace", "Delete"]}
            selectionKeyCode={["Shift"]}
            multiSelectionKeyCode={["Meta", "Control"]}
            panOnScroll
            zoomOnScroll
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: true,
              style: { strokeWidth: 2, stroke: "hsl(var(--primary))" },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              color="hsl(var(--canvas-dot))"
            />

            <Controls
              showZoom={false}
              showFitView={false}
              showInteractive={false}
              className="!bottom-4 !right-4 !left-auto !top-auto !border-border !shadow-sm"
            />

            <MiniMap
              nodeColor={getNodeColor}
              maskColor="hsl(var(--background) / 0.8)"
              className="!bottom-4 !right-16 !border-border !rounded-lg !shadow-sm"
              pannable
              zoomable
            />



            {nodes.length === 0 && (
              <Panel position="top-left" className="m-4 ml-8 lg:ml-4">
                <div className="bg-card/90 backdrop-blur-sm border rounded-lg p-6 max-w-sm shadow-lg pointer-events-none select-none">
                  <h2 className="font-semibold text-foreground mb-2">
                    Start Building Your Funnel
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag node types from the sidebar onto the canvas. Connect
                    nodes by dragging from the bottom handle to the top handle of
                    another node.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Pan: Click and drag on canvas</li>
                    <li>• Zoom: Scroll or pinch</li>
                    <li>• Delete: Select node + Backspace</li>
                  </ul>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </main>
      </div>
    </div>
  );
};
