/**
 * Freighter wallet integration — browser extension bridge.
 * The app never sees private keys. All signing goes through Freighter's popup.
 */

const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015"
const TIMEOUT_MS = 5000

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
 * Race a promise against a timeout.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ])
}

/**
 * Check if Freighter extension is injected in the page.
 */
function isFreighterInjected(): boolean {
  return typeof window !== "undefined" && !!(window as any).freighter
}

/**
 * Dynamically import Freighter API (only works in browser).
 */
async function getFreighterApi() {
  try {
    const mod = await import("@stellar/freighter-api")
    return mod
  } catch {
    return null
  }
}

/**
 * Check if Freighter is available and responsive.
 */
export async function isFreighterAvailable(): Promise<boolean> {
  if (!isFreighterInjected()) return false
  try {
    const api = await getFreighterApi()
    if (!api) return false
    const result = await withTimeout(api.isConnected(), TIMEOUT_MS, { isConnected: false })
    return result.isConnected === true
  } catch {
    return false
  }
}

/**
 * Connect to Freighter — opens the approval popup.
 */
export async function connectWallet(): Promise<WalletInfo> {
  if (!isFreighterInjected()) {
    throw new FreighterError(
      "Freighter wallet extension is not installed. Install it from https://freighter.app",
      "NOT_INSTALLED"
    )
  }

  const api = await getFreighterApi()
  if (!api) {
    throw new FreighterError("Could not load Freighter API", "API_LOAD_FAILED")
  }

  try {
    const access = await withTimeout(api.requestAccess(), TIMEOUT_MS, null)
    if (!access || access.error) {
      throw new FreighterError(access?.error?.message || "Access denied by user", "ACCESS_DENIED")
    }

    let network = ""
    try {
      const details = await withTimeout(api.getNetworkDetails(), TIMEOUT_MS, null)
      network = details?.networkPassphrase || ""
    } catch {
      // Network detection failed, default to testnet
      network = TESTNET_PASSPHRASE
    }

    const isTestnet = network === TESTNET_PASSPHRASE || network.includes("Test") || network === ""

    return { address: access.address, network, isTestnet }
  } catch (err: any) {
    if (err instanceof FreighterError) throw err
    throw new FreighterError(err.message || "Failed to connect", "CONNECT_FAILED")
  }
}

/**
 * Check if user already approved this site (silent, no popup).
 */
export async function checkExistingAccess(): Promise<WalletInfo | null> {
  if (!isFreighterInjected()) return null

  const api = await getFreighterApi()
  if (!api) return null

  try {
    const allowed = await withTimeout(api.isAllowed(), TIMEOUT_MS, { isAllowed: false })
    if (!allowed.isAllowed) return null

    const access = await withTimeout(api.getAddress(), TIMEOUT_MS, null)
    if (!access || !access.address || access.error) return null

    let network = ""
    try {
      const details = await withTimeout(api.getNetworkDetails(), TIMEOUT_MS, null)
      network = details?.networkPassphrase || ""
    } catch {
      network = TESTNET_PASSPHRASE
    }

    const isTestnet = network === TESTNET_PASSPHRASE || network.includes("Test") || network === ""

    return { address: access.address, network, isTestnet }
  } catch {
    return null
  }
}

/**
 * Sign an XDR transaction through Freighter's popup.
 */
export async function signXdr(
  xdr: string,
  address: string,
  networkPassphrase: string = TESTNET_PASSPHRASE
): Promise<string> {
  const api = await getFreighterApi()
  if (!api) throw new FreighterError("Freighter API not available", "API_UNAVAILABLE")

  try {
    const result = await api.signTransaction(xdr, {
      address,
      networkPassphrase,
    })
    if (result.error) {
      throw new FreighterError(result.error.message || "Signing failed", "SIGN_FAILED")
    }
    return result.signedTxXdr
  } catch (err: any) {
    if (err instanceof FreighterError) throw err
    throw new FreighterError(err.message || "Signing failed", "SIGN_FAILED")
  }
}
