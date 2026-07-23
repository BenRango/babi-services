import { CreerDemandeInput, Demande, DemandeMode, DemandeStatut, TypeDescription } from "@/types/demande";
import { delay, demandes, nextId } from "./_mockData";

/**
 * Mock temporaire tant que l'Étape 3 ne branche pas POST /demandes (multipart) —
 * la lecture (Mes demandes, détail) utilise déjà l'API réelle, donc une demande
 * créée ici n'apparaîtra pas dans ces écrans avant l'Étape 3.
 */
export async function createDemande(input: CreerDemandeInput): Promise<Demande> {
  const demande: Demande = {
    id: nextId("demande"),
    clientId: "mock-client",
    categorie: input.categorie,
    picture_url: input.photos[0] ?? null,
    typeDescription: input.noteVocale ? TypeDescription.AUDIO : TypeDescription.TEXT,
    description: input.noteVocale?.uri ?? input.description,
    budgetMaxFcfa: input.budgetMax,
    mode: input.modeRecherche === "libre" ? DemandeMode.RECHERCHE : DemandeMode.POST_PUBLIC,
    statut: DemandeStatut.OUVERTE,
    expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    offres: [],
  };
  demandes.push(demande);
  return delay(demande, 900);
}

export async function annulerDemande(id: string): Promise<void> {
  const demande = demandes.find((d) => d.id === id);
  if (!demande) throw new Error("Demande introuvable");
  demande.statut = DemandeStatut.ANNULEE;
  return delay(undefined, 400);
}
