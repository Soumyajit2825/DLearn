"use client"

import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { WalletProvider } from "@/providers/wallet-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <WalletProvider>
          <TooltipProvider delayDuration={0}>
            {children}
          </TooltipProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
