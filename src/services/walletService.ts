import { Transaction, Wallet } from "@/types/wallet";
import { delay, transactions, wallet } from "./_mockData";

export async function getWallet(): Promise<Wallet> {
  return delay({ ...wallet });
}

export async function listTransactions(): Promise<Transaction[]> {
  return delay([...transactions]);
}
