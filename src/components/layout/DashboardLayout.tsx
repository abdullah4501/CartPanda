import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-canvas">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
            <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
                {children}
            </main>
        </div>
    );
};
