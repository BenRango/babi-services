export type CategorieService =
  | "plomberie"
  | "electricite"
  | "menage"
  | "climatisation"
  | "peinture"
  | "menuiserie"
  | "autres";

export type StatutDemande = "ouverte" | "en_cours" | "fermee" | "annulee";

export type ModeRecherche = "libre" | "annonce_publique";

export interface NoteVocale {
  uri: string;
  dureeSec: number;
}

export interface Demande {
  id: string;
  categorie: CategorieService;
  description: string;
  noteVocale?: NoteVocale;
  photos: string[];
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
  noteVocale?: NoteVocale;
  photos: string[];
  budgetMax: number;
  modeRecherche: ModeRecherche;
}
