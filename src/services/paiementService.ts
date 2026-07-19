import { PaiementRequest, PaiementResult } from "@/types/wallet";
import { delay, nextId, prestations, transactions, wallet } from "./_mockData";

export async function initierPaiement(request: PaiementRequest): Promise<PaiementResult> {
  const prestation = prestations.find((p) => p.id === request.prestationId);
  if (!prestation) throw new Error("Prestation introuvable");

  wallet.soldeBloqueFcfa += request.montant;
  transactions.unshift({
    id: nextId("trx"),
    title: `Paiement — ${prestation.prestataire.nom}`,
    amount: request.montant,
    date: "Aujourd'hui",
    type: "debit",
  });

  return delay({ success: true, refExterne: nextId("ref") }, 1200);
}
