import { Prestation } from "@/types/prestation";

/**
 * Pas encore branché sur un vrai endpoint (Étape 4, en attente des routes
 * accepter/refuser côté backend) — l'UI désactive déjà les boutons
 * Accepter/Refuser en attendant.
 */
export async function accepterOffre(_id: string): Promise<Prestation> {
  throw new Error("Acceptation d'offre pas encore disponible.");
}

export async function refuserOffre(_id: string): Promise<void> {
  throw new Error("Refus d'offre pas encore disponible.");
}
