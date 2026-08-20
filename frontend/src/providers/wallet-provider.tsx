"use client"

import * as React from "react"
import { StellarWalletsKit, WalletNetwork, FreightWalletModule } from "@stellar/stellar-sdk"

interface WalletContextType {
  address: string | null
  network: WalletNetwork
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  signAndSend: (xdr: string) => Promise<string>
}

const WalletContext = React.createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = React.useState<string | null>(null)
  const [connected, setConnected] = React.useState(false)
  const [connecting, setConnecting] = React.useState(false)
  const [kit, setKit] = React.useState<StellarWalletsKit | null>(null)

  React.useEffect(() => {
    const walletKit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: "freight",
      modules: [new FreightWalletModule()],
    })
    setKit(walletKit)

    // Check if already connected
    const savedAddress = localStorage.getItem("stellar_address")
    if (savedAddress) {
      setAddress(savedAddress)
      setConnected(true)
    }
  }, [])

  const connect = async () => {
    if (!kit) return
    setConnecting(true)
    try {
      await kit.connect()
      const addr = kit.address
      setAddress(addr)
      setConnected(true)
      localStorage.setItem("stellar_address", addr)
    } catch (err) {
      console.error("Wallet connection failed:", err)
      throw err
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    if (kit) kit.disconnect()
    setAddress(null)
    setConnected(false)
    localStorage.removeItem("stellar_address")
  }

  const signAndSend = async (xdr: string): Promise<string> => {
    if (!kit || !connected) throw new Error("Wallet not connected")
    const result = await kit.signAndSendXDR(xdr, {
      network: WalletNetwork.TESTNET,
      accountToSign: address!,
    })
    return result.hash
  }

  return (
    <WalletContext.Provider value={{ address, network: WalletNetwork.TESTNET, connected, connecting, connect, disconnect, signAndSend }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = React.useContext(WalletContext)
  if (!context) throw new Error("useWallet must be used within WalletProvider")
  return context
}
