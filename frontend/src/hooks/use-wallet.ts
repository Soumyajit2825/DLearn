"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  connectWallet,
  checkExistingAccess,
  isFreighterAvailable,
} from "@/lib/freighter"

const STORAGE_KEY = "dlearn:stellar_address"
const DISCONNECT_KEY = "dlearn:disconnected"
const POLL_INTERVAL = 5000

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
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const disconnectedRef = useRef(false)
  const mountedRef = useRef(false)

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  // Restore session on mount — silently, no blocking
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    if (localStorage.getItem(DISCONNECT_KEY)) {
      disconnectedRef.current = true
      return
    }

    const savedAddress = localStorage.getItem(STORAGE_KEY)
    if (!savedAddress) return

    // Non-blocking session restore
    checkExistingAccess()
      .then((wallet) => {
        if (wallet && wallet.address === savedAddress) {
          setAddress(wallet.address)
          setNetwork(wallet.network)
          setIsTestnet(wallet.isTestnet)
          setStatus("connected")
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      })
      .catch(() => {})
  }, [])

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
      } catch {}
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
      // Reset to idle after 3 seconds so user can retry
      setTimeout(() => setStatus("idle"), 3000)
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
