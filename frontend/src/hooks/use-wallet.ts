"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  connectWallet,
  checkExistingAccess,
  isFreighterAvailable,
  type WalletInfo,
} from "@/lib/freighter"

const STORAGE_KEY = "dlearn:stellar_address"
const DISCONNECT_KEY = "dlearn:disconnected"
const POLL_INTERVAL = 4000

export type WalletStatus = "idle" | "connecting" | "connected" | "error"

interface UseWalletReturn {
  status: WalletStatus
  address: string | null
  network: string | null
  isTestnet: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

export function useWallet(): UseWalletReturn {
  const [status, setStatus] = useState<WalletStatus>("idle")
  const [address, setAddress] = useState<string | null>(null)
  const [network, setNetwork] = useState<string | null>(null)
  const [isTestnet, setIsTestnet] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const disconnectedRef = useRef(false)

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const restoreSession = useCallback(async () => {
    // Check if user explicitly disconnected
    if (localStorage.getItem(DISCONNECT_KEY)) {
      disconnectedRef.current = true
      return
    }

    const savedAddress = localStorage.getItem(STORAGE_KEY)
    if (!savedAddress) return

    try {
      const wallet = await checkExistingAccess()
      if (wallet && wallet.address === savedAddress) {
        setAddress(wallet.address)
        setNetwork(wallet.network)
        setIsTestnet(wallet.isTestnet)
        setStatus("connected")
      } else {
        // Address changed or no longer connected
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // Silently fail — user may have disconnected Freighter
    }
  }, [])

  // Restore session on mount
  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  // Poll for address/network changes
  useEffect(() => {
    if (status !== "connected" || disconnectedRef.current) return

    pollRef.current = setInterval(async () => {
      try {
        const wallet = await checkExistingAccess()
        if (wallet) {
          setAddress(wallet.address)
          setNetwork(wallet.network)
          setIsTestnet(wallet.isTestnet)
        }
      } catch {
        // Extension may have been disabled
      }
    }, POLL_INTERVAL)

    return () => stopPolling()
  }, [status, stopPolling])

  const connect = useCallback(async () => {
    setError(null)
    setStatus("connecting")

    try {
      const wallet = await connectWallet()
      setAddress(wallet.address)
      setNetwork(wallet.network)
      setIsTestnet(wallet.isTestnet)
      setStatus("connected")
      localStorage.setItem(STORAGE_KEY, wallet.address)
      localStorage.removeItem(DISCONNECT_KEY)
      disconnectedRef.current = false
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
      setStatus("error")
    }
  }, [])

  const disconnect = useCallback(() => {
    stopPolling()
    setAddress(null)
    setNetwork(null)
    setIsTestnet(false)
    setStatus("idle")
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.setItem(DISCONNECT_KEY, "true")
    disconnectedRef.current = true
  }, [stopPolling])

  return { status, address, network, isTestnet, error, connect, disconnect }
}
