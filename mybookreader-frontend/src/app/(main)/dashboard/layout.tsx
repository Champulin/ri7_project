'use client';

import { ReactNode, useState, useContext } from 'react';
import Link from 'next/link'; // For navigation
import clsx from 'clsx';
import AuthContext from '../../context/AuthContext'; // Import AuthContext

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isOpen, setIsOpen] = useState(false); // Track popover state
    const { logout } = useContext(AuthContext); // Use logout function from AuthContext

    const togglePopover = () => setIsOpen((prev) => !prev); // Toggle popover state

    return (
        <div className="dashboard-layout">
            {/* Sidebar and Navigation */}
            <div className="md:hidden">
                <nav className="relative text-primary font-poppins">
                    <div className="flex flex-row space-x-2 items-center">
                        <div>
                            {/* Button to toggle popover */}
                            <button
                                onClick={togglePopover}
                                className="p-4 focus:outline-none"
                                aria-expanded={isOpen}
                                aria-controls="mobile-menu"
                            >
                                {isOpen ? (
                                    <div className="flex size-5 text-formideo-white">✖</div>
                                ) : (
                                    <div className="size-5 text-formideo-white">☰</div>
                                )}
                            </button>

                            {/* Popover content */}
                            {isOpen && (
                                <div
                                    id="mobile-menu"
                                    className={clsx(
                                        'absolute rounded-lg bg-formideo-white w-[90%] p-4 transition duration-200 ease-in-out z-10',
                                        isOpen ? 'block' : 'hidden'
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <div className="space-y-4 font-bold">
                                            <div>
                                                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                                    Dashboard
                                                </Link>
                                            </div>
                                            <div>
                                                <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                                                    Profile
                                                </Link>
                                            </div>
                                            <div>
                                                <Link href="/dashboard/books" onClick={() => setIsOpen(false)}>
                                                    Book List
                                                </Link>
                                            </div>
                                            <div>
                                                <Link href="/dashboard/user-reviews" onClick={() => setIsOpen(false)}>
                                                    Reviews
                                                </Link>
                                            </div>
                                            <div>
                                                <button onClick={logout} className="text-red-500">
                                                    Log Off
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Sidebar for larger screens */}
            <aside className="navbar-large hidden md:flex">
                <ul className="flex flex-row space-x-4 text-lg mx-auto">
                    <li>
                        <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/profile">Profile</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/books">Book List</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/user-reviews">Reviews</Link>
                    </li>
                    <li>
                        <button onClick={logout} className="text-red-500">
                            Log Off
                        </button>
                    </li>
                </ul>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">{children}</main>
        </div>
    );
};

export default DashboardLayout;
