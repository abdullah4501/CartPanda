import { Node, Edge } from "@xyflow/react";

export type NodeType = "sales" | "order" | "upsell" | "downsell" | "thankyou";

export interface FunnelNodeData extends Record<string, unknown> {
  label: string;
  nodeType: NodeType;
  buttonLabel: string;
  hasWarning?: boolean;
  warningMessage?: string;
}

export type FunnelNode = Node<FunnelNodeData, "funnelNode">;
export type FunnelEdge = Edge;

export interface FunnelState {
  nodes: FunnelNode[];
  edges: FunnelEdge[];
}

export interface NodeTypeConfig {
  type: NodeType;
  label: string;
  defaultButtonLabel: string;
  icon: string;
  color: string;
  description: string;
  maxOutgoing?: number;
  canHaveOutgoing: boolean;
}

export const NODE_TYPE_CONFIGS: Record<NodeType, NodeTypeConfig> = {
  sales: {
    type: "sales",
    label: "Sales Page",
    defaultButtonLabel: "Buy Now",
    icon: "ShoppingBag",
    color: "node-sales",
    description: "Landing page with product info",
    maxOutgoing: 1,
    canHaveOutgoing: true,
  },
  order: {
    type: "order",
    label: "Order Page",
    defaultButtonLabel: "Complete Order",
    icon: "CreditCard",
    color: "node-order",
    description: "Checkout and payment form",
    canHaveOutgoing: true,
  },
  upsell: {
    type: "upsell",
    label: "Upsell",
    defaultButtonLabel: "Yes, Add This!",
    icon: "TrendingUp",
    color: "node-upsell",
    description: "Additional offer after purchase",
    canHaveOutgoing: true,
  },
  downsell: {
    type: "downsell",
    label: "Downsell",
    defaultButtonLabel: "Get This Instead",
    icon: "TrendingDown",
    color: "node-downsell",
    description: "Alternative offer if upsell declined",
    canHaveOutgoing: true,
  },
  thankyou: {
    type: "thankyou",
    label: "Thank You",
    defaultButtonLabel: "Continue",
    icon: "CheckCircle",
    color: "node-thankyou",
    description: "Order confirmation page",
    canHaveOutgoing: false,
  },
};

export interface ValidationIssue {
  type: "error" | "warning";
  message: string;
  nodeId?: string;
}
