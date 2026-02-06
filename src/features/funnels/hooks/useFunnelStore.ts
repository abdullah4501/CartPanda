import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "@xyflow/react";
import {
  FunnelNode,
  FunnelState,
  NodeType,
  NODE_TYPE_CONFIGS,
  FunnelNodeData,
  ValidationIssue,
} from "@/features/funnels/types/funnel";

const STORAGE_KEY = "funnel-builder-state";

interface FunnelStore extends FunnelState {
  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  validateFunnel: () => ValidationIssue[];
  saveFunnel: () => void;
  loadFunnel: (state: FunnelState) => void;
  exportFunnel: () => string;
  importFunnel: (json: string) => boolean;
  clearFunnel: () => void;
  setNodes: (nodes: FunnelNode[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export const useFunnelStore = create<FunnelStore>((set, get) => {
  // Initial state loading
  const loadInitialState = (): FunnelState => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.edges) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load funnel state:", e);
    }
    return { nodes: [], edges: [] };
  };

  const initialState = loadInitialState();

  return {
    nodes: initialState.nodes,
    edges: initialState.edges,

    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes) as FunnelNode[],
      });
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },

    onConnect: (connection: Connection) => {
      const { nodes } = get();
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const sourceData = sourceNode?.data as FunnelNodeData | undefined;

      if (sourceData?.nodeType) {
        const config = NODE_TYPE_CONFIGS[sourceData.nodeType];
        if (!config.canHaveOutgoing) {
          return;
        }
      }

      set({
        edges: addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: true,
            style: { strokeWidth: 2 },
          },
          get().edges
        ),
      });
    },

    addNode: (type: NodeType, position: { x: number; y: number }) => {
      const { nodes } = get();

      // Calculate counts for labels
      let typeCount = 0;
      nodes.forEach(n => {
        if ((n.data as FunnelNodeData).nodeType === type) typeCount++;
      });
      const count = typeCount + 1;

      const config = NODE_TYPE_CONFIGS[type];
      let label = config.label;
      if (type === "upsell" || type === "downsell") {
        label = `${config.label} ${count}`;
      }

      const newNode: FunnelNode = {
        id: `${type}-${Date.now()}`,
        type: "funnelNode",
        position,
        data: {
          label,
          nodeType: type,
          buttonLabel: config.defaultButtonLabel,
        },
      };

      set({ nodes: [...nodes, newNode] });
    },

    deleteNode: (nodeId: string) => {
      set({
        nodes: get().nodes.filter((n) => n.id !== nodeId),
        edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      });
    },

    deleteEdge: (edgeId: string) => {
      set({
        edges: get().edges.filter((e) => e.id !== edgeId),
      });
    },

    validateFunnel: () => {
      const { nodes, edges } = get();
      const issues: ValidationIssue[] = [];

      nodes.forEach((node) => {
        const data = node.data as FunnelNodeData;
        const hasIncoming = edges.some((e) => e.target === node.id);
        const hasOutgoing = edges.some((e) => e.source === node.id);

        if (!hasIncoming && !hasOutgoing) {
          issues.push({
            type: "warning",
            message: `"${data.label}" is not connected`,
            nodeId: node.id,
          });
        }

        if (data.nodeType === "sales") {
          const outgoingCount = edges.filter((e) => e.source === node.id).length;
          if (outgoingCount === 0) {
            issues.push({
              type: "warning",
              message: `"${data.label}" needs connection to Order Page`,
              nodeId: node.id,
            });
          } else if (outgoingCount > 1) {
            issues.push({
              type: "warning",
              message: `"${data.label}" has too many connections`,
              nodeId: node.id,
            });
          }
        }

        if (data.nodeType === "thankyou") {
          const outgoingCount = edges.filter((e) => e.source === node.id).length;
          if (outgoingCount > 0) {
            issues.push({
              type: "error",
              message: `"${data.label}" cannot have outgoing connections`,
              nodeId: node.id,
            });
          }
        }
      });

      const hasSales = nodes.some((n) => (n.data as FunnelNodeData).nodeType === "sales");
      const hasThankYou = nodes.some((n) => (n.data as FunnelNodeData).nodeType === "thankyou");

      if (nodes.length > 0) {
        if (!hasSales) issues.push({ type: "warning", message: "Missing Sales Page" });
        if (!hasThankYou) issues.push({ type: "warning", message: "Missing Thank You Page" });
      }

      return issues;
    },

    saveFunnel: () => {
      const { nodes, edges } = get();
      const state: FunnelState = { nodes, edges };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },

    loadFunnel: (state: FunnelState) => {
      set({ nodes: state.nodes, edges: state.edges });
    },

    exportFunnel: () => {
      const { nodes, edges } = get();
      return JSON.stringify({ nodes, edges }, null, 2);
    },

    importFunnel: (json: string) => {
      try {
        const state = JSON.parse(json);
        if (state.nodes && state.edges) {
          set({ nodes: state.nodes, edges: state.edges });
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },

    clearFunnel: () => {
      set({ nodes: [], edges: [] });
      localStorage.removeItem(STORAGE_KEY);
    },

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
  };
});
