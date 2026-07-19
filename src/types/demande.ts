export type CategorieService =
  | "plomberie"
  | "electricite"
  | "menage"
  | "climatisation"
  | "peinture"
  | "menuiserie";

export type StatutDemande = "ouverte" | "en_cours" | "fermee" | "annulee";

export type ModeRecherche = "libre" | "annonce_publique";

export interface Demande {
  id: string;
  categorie: CategorieService;
  description: string;
  budgetMax: number;
  modeRecherche: ModeRecherche;
  statut: StatutDemande;
  dateCreation: string;
  offresCount: number;
  prestationId?: string;
}

export interface CreerDemandeInput {
  categorie: CategorieService;
  description: string;
  budgetMax: number;
  modeRecherche: ModeRecherche;
}
