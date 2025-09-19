"use client";

import Link from "next/link";
import Image from 'next/image';
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // shadcn utility for conditional classNames

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/cus", label: "Assignment Rubric Library" },
  ];

  return (
    <aside className="w-56 bg-gray-200 flex flex-col justify-between min-h-screen">
      {/* Logo + title */}
      <div>
        <div className="flex items-center gap-2 p-4">
            <img
                src="/logo.png"
                alt="AI Use Scales Logo"
                className="w-10 h-10 rounded-full object-cover"
            />
  <span className="text-sm font-semibold">AI Use Scales</span>
</div>

        {/* Links for pages */}
        <nav className="flex flex-col gap-2 px-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-2 py-1 rounded hover:bg-gray-300",
                pathname === link.href
                  ? "font-bold text-primary-600 bg-gray-300"
                  : "text-gray-700"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <Link
        href="/profile"
        className="block p-4 text-xs font-semibold text-gray-600 text-center hover:text-primary-600 hover:bg-gray-300"
      >
        Profile and Settings
      </Link>
    </aside>
  );
}