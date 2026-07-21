import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/layout/ChatWindow";

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] =
    useState(() =>
      typeof window !== "undefined"
        ? window.innerWidth >= 768
        : true
    );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="flex-1 min-w-0">
        <ChatWindow
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
    </div>
  );
}