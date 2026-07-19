import { CreerDemandeInput, Demande } from "@/types/demande";
import { Offre } from "@/types/offre";
import { PRESTATAIRES_POOL, delay, demandes, nextId, offres } from "./_mockData";

export async function listDemandes(): Promise<Demande[]> {
  return delay(
    [...demandes].sort((a, b) => (a.dateCreation < b.dateCreation ? 1 : -1))
  );
}

export async function getDemande(id: string): Promise<Demande> {
  const demande = demandes.find((d) => d.id === id);
  if (!demande) throw new Error("Demande introuvable");
  return delay(demande);
}

/**
 * Crée la demande puis simule la réponse de 2 à 3 prestataires du pool —
 * un vrai backend renverrait juste la demande "ouverte" ; les offres
 * arriveraient plus tard via la liste `listOffresForDemande`.
 */
export async function createDemande(input: CreerDemandeInput): Promise<Demande> {
  const demande: Demande = {
    id: nextId("demande"),
    ...input,
    statut: "en_cours",
    dateCreation: new Date().toISOString(),
    offresCount: 0,
  };
  demandes.push(demande);

  const nbOffres = 2 + Math.floor(Math.random() * 2);
  const candidats = [...PRESTATAIRES_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, nbOffres);

  candidats.forEach((prestataire, index) => {
    const offre: Offre = {
      id: nextId("offre"),
      demandeId: demande.id,
      prestataire,
      prix: Math.round((input.budgetMax * (0.75 + Math.random() * 0.35)) / 500) * 500,
      delaiHeures: 1 + Math.floor(Math.random() * 5),
      message: "Disponible rapidement, travail soigné et garanti.",
      statut: "en_attente",
      dateEnvoi: new Date().toISOString(),
      recommandee: index === 0,
    };
    offres.push(offre);
  });
  demande.offresCount = nbOffres;

  return delay(demande, 900);
}

export async function annulerDemande(id: string): Promise<void> {
  const demande = demandes.find((d) => d.id === id);
  if (!demande) throw new Error("Demande introuvable");
  demande.statut = "annulee";
  return delay(undefined, 400);
}
