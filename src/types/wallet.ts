export type TypePaiement = "orange_money" | "mtn_money" | "wave" | "carte";

export interface Wallet {
  soldeFcfa: number;
  soldeBloqueFcfa: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
}

export interface PaiementRequest {
  prestationId: string;
  methode: TypePaiement;
  montant: number;
}

export interface PaiementResult {
  success: boolean;
  refExterne: string;
}
