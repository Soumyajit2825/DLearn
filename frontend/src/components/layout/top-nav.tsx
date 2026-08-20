"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, Menu, Sun, Moon, Wallet } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/providers/auth-provider"
import { useWallet } from "@/providers/wallet-provider"

interface TopNavProps {
  onMenuClick?: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, logout } = useAuth()
  const { connected, address, connect, connecting } = useWallet()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-hairline bg-canvas/80 backdrop-blur-sm px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="hidden sm:relative sm:flex sm:items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-soft" />
        <Input
          placeholder="Search courses..."
          className="h-10 w-64 rounded-pill border-hairline bg-surface-strong pl-10 text-sm focus:bg-canvas"
        />
      </div>

      {/* Wallet Button */}
      <Button
        variant={connected ? "outline" : "ghost"}
        size="sm"
        onClick={connect}
        loading={connecting}
        className={cn("text-sm", connected && "border-semantic-up text-semantic-up")}
      >
        <Wallet className="h-4 w-4 mr-1.5" />
        {connected ? `${address?.slice(0, 4)}...${address?.slice(-4)}` : "Connect Wallet"}
      </Button>

      {mounted && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-body"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      )}

      <Link href="/dashboard/notifications" className="relative">
        <Button variant="ghost" size="icon" className="text-body">
          <Bell className="h-5 w-5" />
          <Badge variant="danger" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
            3
          </Badge>
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
            <Avatar>
              <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.full_name}</span>
              <span className="text-xs font-normal text-muted">{user?.email}</span>
              {connected && (
                <span className="text-xs font-mono text-semantic-up mt-1">
                  {address?.slice(0, 8)}...{address?.slice(-6)}
                </span>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/certificates">Certificates</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/pricing">Upgrade Plan</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={logout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
