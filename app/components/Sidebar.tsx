import React from "react";
import { Database, Server, Network } from "lucide-react";

export default function Sidebar() {
  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    label: string
  ) => {
    // We store the type and label to retrieve them when dropping
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/label", label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-4 h-full">
      <h2 className="text-lg font-bold text-slate-700">Components</h2>
      <p className="text-xs text-slate-500 mb-2">Drag these to the canvas</p>

      <div
        className="flex items-center gap-2 p-3 bg-white border border-slate-300 rounded cursor-grab hover:shadow-md transition-all"
        onDragStart={(event) =>
          onDragStart(event, "loadBalancer", "Load Balancer")
        }
        draggable
      >
        <Network size={20} className="text-blue-500" />
        <span>Load Balancer</span>
      </div>

      <div
        className="flex items-center gap-2 p-3 bg-white border border-slate-300 rounded cursor-grab hover:shadow-md transition-all"
        onDragStart={(event) => onDragStart(event, "webServer", "Web Server")}
        draggable
      >
        <Server size={20} className="text-green-500" />
        <span>Web Server</span>
      </div>

      <div
        className="flex items-center gap-2 p-3 bg-white border border-slate-300 rounded cursor-grab hover:shadow-md transition-all"
        onDragStart={(event) => onDragStart(event, "database", "Database")}
        draggable
      >
        <Database size={20} className="text-purple-500" />
        <span>Database</span>
      </div>
    </aside>
  );
}
