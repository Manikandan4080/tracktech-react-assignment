"use client"
import { CalendarRange, Clock, Factory, Home, Package, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const navLinks = [
        { name: "Dashboard", path: "/", icon: <Home size={16} /> },
        { name: "Units", path: "/units", icon: <Factory size={16} /> },
        { name: "Lines", path: "/lines", icon: <Users size={16} /> },
        { name: "Shifts", path: "/shifts", icon: <Clock size={16} /> },
        { name: "Orders", path: "/orders", icon: <Package size={16} /> },
        { name: "Schedule", path: "/schedule", icon: <CalendarRange size={16} /> },
    ];

    const onNavigate = (path: string) => {
        router.push(path);
    };

    const isActive = (navItem: {
        name: string;
        path: string;
        icon: React.JSX.Element;
    }) => {
        return pathname === navItem.path;
    };

    return (
        <section className="bottom-0 w-full md:w-fit h-fit md:h-full bg-[#F7F7F5] p-2 flex flex-row md:flex-col justify-between md:justify-center rounded-tl-lg  rounded-tr-lg md:rounded-tl-none md:rounded-br-lg  items-center">
            {navLinks.map((navItem) => (
                <div
                    onClick={() => onNavigate(navItem.path)}
                    key={navItem.name}
                    className="flex flex-col items-center justify-center cursor-pointer mb-2"
                >
                    <button
                        className={`p-2 ${
                            isActive(navItem)
                                ? "bg-[#222] text-white"
                                : "bg-transparent"
                        } rounded-lg px-3 cursor-pointer`}
                    >
                        {navItem.icon}
                    </button>
                    <p className="text-[12px]">{navItem.name}</p>
                </div>
            ))}
        </section>
    );
};

export default Navbar;
