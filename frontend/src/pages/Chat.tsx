import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/layout/ChatWindow";

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
      />

      <div className="flex-1">
        <ChatWindow
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
    </div>
  );
}