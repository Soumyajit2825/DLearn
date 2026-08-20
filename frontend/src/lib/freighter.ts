/**
 * Freighter wallet integration — browser extension bridge.
 * The app never sees private keys. All signing goes through Freighter's popup.
 */

import {
  isConnected,
  isAllowed,
  requestAccess,
  signTransaction,
  getNetwork,
  getNetworkDetails,
} from "@stellar/freighter-api"

const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015"

export interface WalletInfo {
  address: string
  network: string
  isTestnet: boolean
}

export class FreighterError extends Error {
  code: string
  constructor(message: string, code: string = "FREIGHTER_ERROR") {
    super(message)
    this.name = "FreighterError"
    this.code = code
  }
}

/**
 * Check if Freighter extension is installed and injecting.
 */
export async function isFreighterAvailable(): Promise<boolean> {
  try {
    const result = await isConnected()
    return result.isConnected === true
  } catch {
    return false
  }
}

/**
 * Get the current network from Freighter.
 */
async function getCurrentNetwork(): Promise<string> {
  try {
    const details = await getNetworkDetails()
    return details.networkPassphrase || ""
  } catch {
    return ""
  }
}

/**
 * Connect to Freighter — opens the approval popup.
 * Returns the user's Stellar address.
 */
export async function connectWallet(): Promise<WalletInfo> {
  const available = await isFreighterAvailable()
  if (!available) {
    throw new FreighterError(
      "Freighter wallet extension is not installed. Please install it from https://freighter.app",
      "NOT_INSTALLED"
    )
  }

  try {
    const access = await requestAccess()
    if (access.error) {
      throw new FreighterError(access.error.message || "Access denied", "ACCESS_DENIED")
    }

    const network = await getCurrentNetwork()
    const isTestnet = network === TESTNET_PASSPHRASE || network.includes("Test")

    return {
      address: access.address,
      network,
      isTestnet,
    }
  } catch (err: any) {
    if (err instanceof FreighterError) throw err
    if (err.message?.includes("declined") || err.message?.includes("reject")) {
      throw new FreighterError("Connection was declined by the user", "DECLINED")
    }
    throw new FreighterError(err.message || "Failed to connect to Freighter", "CONNECT_FAILED")
  }
}

/**
 * Check if the user already approved this site (silent, no popup).
 */
export async function checkExistingAccess(): Promise<WalletInfo | null> {
  try {
    const allowed = await isAllowed()
    if (!allowed) return null

    const access = await getAddress()
    if (!access.address) return null

    const network = await getCurrentNetwork()
    const isTestnet = network === TESTNET_PASSPHRASE || network.includes("Test")

    return {
      address: access.address,
      network,
      isTestnet,
    }
  } catch {
    return null
  }
}

// Import getAddress separately since it's used for silent checks
import { getAddress } from "@stellar/freighter-api"

/**
 * Sign an XDR transaction through Freighter's popup.
 * Returns the signed XDR string.
 */
export async function signXdr(
  xdr: string,
  address: string,
  networkPassphrase: string = TESTNET_PASSPHRASE
): Promise<string> {
  try {
    const result = await signTransaction(xdr, {
      address,
      networkPassphrase,
    })
    if (result.error) {
      throw new FreighterError(result.error.message || "Signing failed", "SIGN_FAILED")
    }
    return result.signedTxXdr
  } catch (err: any) {
    if (err instanceof FreighterError) throw err
    if (err.message?.includes("declined") || err.message?.includes("reject")) {
      throw new FreighterError("Transaction was declined by the user", "SIGN_DECLINED")
    }
    throw new FreighterError(err.message || "Failed to sign transaction", "SIGN_FAILED")
  }
}
