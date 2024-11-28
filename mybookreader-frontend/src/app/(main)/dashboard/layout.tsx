// dashboard/layout.tsx

import { ReactNode } from 'react';
import Link from 'next/link';  // You can use this for navigation
import { AuthProvider } from '@/app/context/AuthContext';  // Import the AuthProvider from the context  // You can create custom styles for your dashboard here

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="dashboard-layout">
            {/* Sidebar and Navigation */}
            <aside className="sidebar">
                <ul>
                    <li><Link href="/dashboard">Dashboard</Link></li>
                    <li><Link href="/dashboard/settings">Settings</Link></li>
                    <li><Link href="/dashboard/profile">Profile</Link></li>
                    {/* Add more links as needed */}
                </ul>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
