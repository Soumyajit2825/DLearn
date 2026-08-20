"use client"

import * as React from "react"
import { useWallet as useWalletHook, type WalletStatus } from "@/hooks/use-wallet"
import { signXdr } from "@/lib/freighter"

interface WalletContextType {
  address: string | null
  network: string | null
  connected: boolean
  connecting: boolean
  isTestnet: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  signXdr: (xdr: string) => Promise<string>
}

const WalletContext = React.createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWalletHook()

  const handleSignXdr = React.useCallback(
    async (xdr: string): Promise<string> => {
      if (!wallet.address) throw new Error("Wallet not connected")
      return signXdr(xdr, wallet.address)
    },
    [wallet.address]
  )

  const value = React.useMemo<WalletContextType>(
    () => ({
      address: wallet.address,
      network: wallet.network,
      connected: wallet.status === "connected",
      connecting: wallet.status === "connecting",
      isTestnet: wallet.isTestnet,
      error: wallet.error,
      connect: wallet.connect,
      disconnect: wallet.disconnect,
      signXdr: handleSignXdr,
    }),
    [wallet, handleSignXdr]
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = React.useContext(WalletContext)
  if (!context) throw new Error("useWallet must be used within WalletProvider")
  return context
}
