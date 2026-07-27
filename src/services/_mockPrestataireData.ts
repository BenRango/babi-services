/**
 * Mock statique et local pour ce qui n'est pas encore branché côté backend
 * (communes déclarées à l'inscription, disponibilité). Muté directement en
 * place (comme _mockData.ts) pour que l'état survive à la navigation dans
 * la session.
 */

export const COMMUNES_ABIDJAN = [
  "Abobo",
  "Adjamé",
  "Attécoubé",
  "Cocody",
  "Koumassi",
  "Marcory",
  "Plateau",
  "Port-Bouët",
  "Treichville",
  "Yopougon",
];

export const disponibilitePrestataire = {
  disponible: true,
  communes: ["Cocody", "Plateau"] as string[],
};
