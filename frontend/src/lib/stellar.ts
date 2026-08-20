/**
 * Stellar Horizon client — balances, payments, account info.
 * Talks directly to Horizon REST API, no backend server needed.
 */

import * as StellarSdk from "@stellar/stellar-sdk"

const HORIZON_URL = "https://horizon-testnet.stellar.org"
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015"

const server = new StellarSdk.Horizon.Server(HORIZON_URL)

/** Convert XLM to stroops (1 XLM = 10,000,000 stroops) */
export function toStroops(xlm: string | number): bigint {
  const parts = xlm.toString().split(".")
  const intPart = parts[0] || "0"
  const decPart = (parts[1] || "").padEnd(7, "0").slice(0, 7)
  return BigInt(intPart) * BigInt(10000000) + BigInt(decPart)
}

/** Convert stroops to XLM */
export function fromStroops(stroops: bigint): string {
  const whole = stroops / BigInt(10000000)
  const frac = stroops % BigInt(10000000)
  const fracStr = frac.toString().padStart(7, "0").replace(/0+$/, "")
  return fracStr ? `${whole}.${fracStr}` : whole.toString()
}

export interface AccountBalance {
  xlm: string
  spendable: string
  funded: boolean
}

export interface PaymentRecord {
  id: string
  type: "payment" | "create_account"
  from: string
  to: string
  amount: string
  asset: string
  timestamp: string
  hash: string
  direction: "sent" | "received"
}

/**
 * Fetch XLM balance for an account.
 * Returns 0 if account doesn't exist yet (unfunded).
 */
export async function getBalance(address: string): Promise<AccountBalance> {
  try {
    const account = await server.loadAccount(address)
    const balance = account.balances.find((b) => b.asset_type === "native")
    const xlm = balance ? balance.balance : "0"
    const xlmNum = parseFloat(xlm)
    // Locked: 1 XLM base reserve + 0.5 stroops fee buffer
    const spendable = Math.max(0, xlmNum - 1.0000050).toFixed(7)
    return { xlm, spendable, funded: true }
  } catch (err: any) {
    if (err.response?.status === 404 || err.message?.includes("Not Found")) {
      return { xlm: "0", spendable: "0", funded: false }
    }
    throw err
  }
}

/**
 * Fund an account using the testnet faucet (Friendbot).
 */
export async function fundAccount(address: string): Promise<void> {
  const response = await fetch(`https://friendbot.stellar.org?addr=${address}`)
  if (!response.ok) {
    throw new Error("Failed to fund account via Friendbot")
  }
}

/**
 * Build an unsigned XDR for a payment.
 */
export async function buildPaymentXdr(
  from: string,
  to: string,
  amountXlm: string,
  memo?: string
): Promise<string> {
  const amount = parseFloat(amountXlm)
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid amount")
  }

  const account = await server.loadAccount(from)

  // Check if destination exists
  let destExists = true
  try {
    await server.loadAccount(to)
  } catch {
    destExists = false
  }

  const txBuilder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })

  if (destExists) {
    txBuilder.addOperation(
      StellarSdk.Operation.payment({
        destination: to,
        asset: StellarSdk.Asset.native(),
        amount: amountXlm,
      })
    )
  } else {
    // createAccount requires minimum 1 XLM
    if (amount < 1) {
      throw new Error("New accounts require at least 1 XLM")
    }
    txBuilder.addOperation(
      StellarSdk.Operation.createAccount({
        destination: to,
        startingBalance: amountXlm,
      })
    )
  }

  if (memo) {
    txBuilder.addMemo(StellarSdk.Memo.text(memo))
  }

  const transaction = txBuilder.setTimeout(180).build()
  return transaction.toXDR()
}

/**
 * Submit a signed XDR to Horizon.
 */
export async function submitSignedXdr(signedXdr: string): Promise<{ hash: string }> {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE
  )
  const result = await server.submitTransaction(transaction)
  return { hash: result.hash }
}

/**
 * Fetch recent payment history for an account.
 */
export async function getPaymentHistory(address: string): Promise<PaymentRecord[]> {
  const response = await server
    .payments()
    .forAccount(address)
    .order("desc")
    .limit(20)
    .call()

  return response.records.map((record: any) => {
    const isPayment = record.type === "payment"
    const isCreateAccount = record.type === "create_account"

    let from = record.from || ""
    let to = record.to || ""
    let amount = record.amount || (isCreateAccount ? record.starting_balance : "0")
    let asset = "XLM"

    // Normalize fields
    if (!from && isCreateAccount) {
      from = record.source_account || ""
    }

    const direction = from === address ? "sent" : "received"
    const timestamp = record.created_at || new Date().toISOString()
    const hash = record.transaction_hash || record.id || ""

    return {
      id: record.id,
      type: isCreateAccount ? "create_account" : "payment",
      from,
      to,
      amount,
      asset,
      timestamp,
      hash,
      direction,
    }
  })
}

/**
 * Build a Soroban contract call XDR (for enrollment/certificate).
 */
export async function buildContractCallXdr(
  contractId: string,
  method: string,
  args: StellarSdk.xdr.ScVal[],
  sourceAddress: string
): Promise<string> {
  const contract = new StellarSdk.Contract(contractId)
  const sourceAccount = await server.loadAccount(sourceAddress)

  const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })

  txBuilder.addOperation(contract.call(method, ...args))

  const transaction = txBuilder.setTimeout(180).build()

  return transaction.toXDR()
}
