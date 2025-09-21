'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  TableProperties,
  PackageOpen,
  User,
  ChevronUp,
  LogOut,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const links = [
  { href: '/my-rubrics', label: 'My Rubrics', icon: TableProperties },
  { href: '/rubric-repo', label: 'Rubric Repository', icon: PackageOpen },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Dummy user data
  const user = {
    name: 'John Doe',
    avatar: '/avatar.svg', // Replace with actual avatar path
  };

  return (
    <aside className="w-56 bg-gray-200 flex flex-col justify-between h-screen fixed left-0 top-0 shadow">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 p-5 border-b border-gray-300">
          <span className="text-lg font-bold tracking-tight">
            AI Use Scales
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4 text-sm">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded transition-colors',
                pathname === href
                  ? 'bg-primary/10 text-primary font-bold shadow'
                  : 'text-gray-700 hover:bg-gray-300',
              )}
            >
              <Icon
                size={18}
                className={pathname === href ? 'text-primary' : 'text-gray-500'}
              />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 justify-start p-3 hover:bg-gray-300"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-gray-800">
                {user.name}
              </span>
              <ChevronUp size={16} className="text-gray-500 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-full">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User size={16} /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <Settings size={16} /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 flex items-center gap-2"
              onClick={() => {
                // Add logout logic here
              }}
            >
              <LogOut size={16} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
