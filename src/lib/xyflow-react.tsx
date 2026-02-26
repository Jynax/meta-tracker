import type { CSSProperties, PropsWithChildren, ReactNode } from 'react';

export type XYPosition = { x: number; y: number };
export type Node<T = Record<string, unknown>> = {
  id: string;
  type?: string;
  position: XYPosition;
  data: T;
  draggable?: boolean;
};

export type Edge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  style?: CSSProperties;
};

export type NodeProps<T = Record<string, unknown>> = { id: string; data: T };
export type NodeTypes = Record<string, (props: NodeProps<any>) => ReactNode>;

export const Position = { Top: 'top', Bottom: 'bottom' } as const;

function midpoint(source: XYPosition, target: XYPosition) {
  const cy = (source.y + target.y) / 2;
  return `M ${source.x + 120} ${source.y + 70} C ${source.x + 120} ${cy}, ${target.x + 120} ${cy}, ${target.x + 120} ${target.y + 8}`;
}

interface ReactFlowProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  className?: string;
  [key: string]: unknown;
}

export default function ReactFlow({ nodes, edges, nodeTypes, className, children }: PropsWithChildren<ReactFlowProps>) {
  const map = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className={`relative h-full w-full overflow-auto ${className ?? ''}`}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {edges.map((edge) => {
          const source = map.get(edge.source);
          const target = map.get(edge.target);
          if (!source || !target) return null;
          return <path key={edge.id} d={midpoint(source.position, target.position)} fill="none" style={edge.style} />;
        })}
      </svg>
      {nodes.map((node) => {
        const Component = nodeTypes[node.type ?? ''];
        if (!Component) return null;
        return (
          <div key={node.id} className="absolute" style={{ transform: `translate(${node.position.x + 900}px, ${node.position.y + 20}px)` }}>
            <Component id={node.id} data={node.data} />
          </div>
        );
      })}
      {children}
    </div>
  );
}

export function Handle(_props: Record<string, unknown>) {
  return null;
}

export function MiniMap(_props: Record<string, unknown>) {
  return null;
}

export function Controls(_props: Record<string, unknown>) {
  return null;
}

export function Background(_props: Record<string, unknown>) {
  return null;
}
