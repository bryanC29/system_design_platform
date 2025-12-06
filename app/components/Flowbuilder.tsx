"use client";

import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  useReactFlow,
  MarkerType,
} from "@xyflow/react";
import Sidebar from "./Sidebar.tsx";

// Initial ID counter
let id = 0;
const getId = () => `dndnode_${id++}`;

const FlowContent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  // Handle connecting two nodes (the line drawing)
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed }, // Adds an arrow to the end of the line
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle Drag Over (Allowing the drop)
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle Drop (Placing the node)
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow/type");
      const label = event.dataTransfer.getData("application/reactflow/label");

      // Check if the drop is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // Calculate exact position on canvas
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Style nodes based on type (simple styling for now)
      let style = {};
      if (type === "database")
        style = { background: "#f3e8ff", border: "1px solid #7e22ce" };
      if (type === "webServer")
        style = { background: "#dcfce7", border: "1px solid #15803d" };
      if (type === "loadBalancer")
        style = { background: "#dbeafe", border: "1px solid #1d4ed8" };

      const newNode = {
        id: getId(),
        type: "default", // Using default type for simplicity, allows input/output
        position,
        data: { label: label },
        style: {
          ...style,
          padding: "10px",
          borderRadius: "5px",
          width: 150,
          textAlign: "center" as const,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div className="flex h-screen w-full flex-row">
      <Sidebar />
      <div className="grow h-full bg-slate-50" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

// Wrap with Provider to access ReactFlow hooks context
export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}
