import { Offre } from "@/types/offre";
import { Prestation } from "@/types/prestation";
import { delay, demandes, nextId, offres, prestations } from "./_mockData";

export async function listOffresForDemande(demandeId: string): Promise<Offre[]> {
  return delay(offres.filter((o) => o.demandeId === demandeId));
}

export async function getOffre(id: string): Promise<Offre> {
  const offre = offres.find((o) => o.id === id);
  if (!offre) throw new Error("Offre introuvable");
  return delay(offre);
}

function genererCodeConfirmation(): string {
  return String(1000 + Math.floor(Math.random() * 9000));
}

/**
 * Accepter une offre : marque les autres offres de la même demande comme
 * refusées, ferme la demande, et crée la Prestation associée (mêmes règles
 * que le backlog : acceptation d'offre → création d'une Prestation).
 */
export async function accepterOffre(id: string): Promise<Prestation> {
  const offre = offres.find((o) => o.id === id);
  if (!offre) throw new Error("Offre introuvable");

  offre.statut = "acceptee";
  offres
    .filter((o) => o.demandeId === offre.demandeId && o.id !== offre.id)
    .forEach((o) => {
      o.statut = "refusee";
    });

  const demande = demandes.find((d) => d.id === offre.demandeId);
  if (!demande) throw new Error("Demande introuvable");
  demande.statut = "fermee";

  const prestation: Prestation = {
    id: nextId("prestation"),
    demandeId: demande.id,
    offreId: offre.id,
    statut: "confirmee",
    codeConfirmation: genererCodeConfirmation(),
    prestataire: offre.prestataire,
    montant: offre.prix,
    paiementLibere: false,
    historique: [{ statut: "confirmee", horodatage: new Date().toISOString() }],
  };
  prestations.push(prestation);
  demande.prestationId = prestation.id;

  return delay(prestation, 900);
}

export async function refuserOffre(id: string): Promise<void> {
  const offre = offres.find((o) => o.id === id);
  if (!offre) throw new Error("Offre introuvable");
  offre.statut = "refusee";
  return delay(undefined, 500);
}
