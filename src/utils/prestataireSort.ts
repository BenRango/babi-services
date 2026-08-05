import { User } from "@/types/user";

/**
 * Toutes les demandes restent visibles pour tous les prestataires, quelle que
 * soit leur commune — celles dans les communes déclarées par le prestataire
 * remontent juste en premier, puis chaque groupe est trié par budget croissant.
 */
export function trierDemandesPourPrestataire<T extends { commune?: string | null; budgetMaxFcfa: number }>(
  demandes: T[],
  user: Pick<User, "communes"> | null | undefined
): T[] {
  const communeCorrespond = (demande: T) =>
    !!demande.commune && !!user?.communes?.includes(demande.commune.toLowerCase());

  return [...demandes].sort((a, b) => {
    const matchA = communeCorrespond(a);
    const matchB = communeCorrespond(b);
    if (matchA !== matchB) return matchA ? -1 : 1;
    return a.budgetMaxFcfa - b.budgetMaxFcfa;
  });
}
