import { categorieLabel } from "@/constants/categories";
import { useNotificationsBadge } from "@/contexts/notificationsBadgeContext";
import { useToast } from "@/contexts/toastContext";
import { Demande } from "@/types/demande";
import { OffreStatut } from "@/types/offre";
import { User, UserRole } from "@/types/user";
import { getStoredUser } from "@api/client";
import { getDemandesOuvertes, getMesDemandes } from "@api/demandes";
import { getMesOffres } from "@api/offres";
import { getMesPrestations } from "@api/prestations";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

const POLLING_MS = 15000;

/**
 * Tourne en permanence tant que l'app est ouverte (peu importe l'écran affiché)
 * pour deux choses : calculer les bulles de la tab bar et déclencher les toasts
 * de nouveauté. Ne persiste rien — purement en mémoire pour la session en cours,
 * pas d'historique consultable (ça, ça attend une vraie table côté backend).
 */
export default function NotificationsPoller() {
  const { setOffresEnAttente, setDemandesSansOffre, setOffresAccepteesNonDemarrees } = useNotificationsBadge();
  const { showToast } = useToast();
  const router = useRouter();

  const offresConnuesRef = useRef<Set<string> | null>(null);
  const demandesConnuesRef = useRef<Set<string> | null>(null);
  const statutsOffresConnusRef = useRef<Map<string, OffreStatut> | null>(null);

  useEffect(() => {
    let annule = false;

    const correspondAuProfil = (demande: Demande, user: User) =>
      !!user.categories?.includes(demande.categorie.toLowerCase()) ||
      (!!demande.commune && !!user.communes?.includes(demande.commune.toLowerCase()));

    const tickClient = async () => {
      const demandes = await getMesDemandes();
      if (annule) return;
      const offres = demandes.flatMap((d) =>
        d.offres.map((o) => ({ ...o, demandeId: d.id, categorie: d.categorie }))
      );

      setOffresEnAttente(offres.filter((o) => o.statut === OffreStatut.EN_ATTENTE).length);

      const idsActuels = new Set(offres.map((o) => o.id));
      if (offresConnuesRef.current === null) {
        offresConnuesRef.current = idsActuels;
        return;
      }
      const nouvelles = offres.filter((o) => !offresConnuesRef.current!.has(o.id));
      offresConnuesRef.current = idsActuels;
      nouvelles.forEach((o) => {
        showToast(`Nouvelle offre reçue sur votre demande ${categorieLabel(o.categorie)} !`, () =>
          router.push(`/(client)/demande/${o.demandeId}/offres`)
        );
      });
    };

    const tickPrestataire = async (user: User) => {
      const [demandes, offres, prestations] = await Promise.all([
        getDemandesOuvertes(),
        getMesOffres(),
        getMesPrestations(),
      ]);
      if (annule) return;

      const idDemandesOffertes = new Set(offres.map((o) => o.demandeId));
      const demandesActionnables = demandes.filter(
        (d) => correspondAuProfil(d, user) && !idDemandesOffertes.has(d.id)
      );
      setDemandesSansOffre(demandesActionnables.length);

      const idsDemandesActuelles = new Set(demandesActionnables.map((d) => d.id));
      if (demandesConnuesRef.current === null) {
        demandesConnuesRef.current = idsDemandesActuelles;
      } else {
        const nouvelles = demandesActionnables.filter((d) => !demandesConnuesRef.current!.has(d.id));
        demandesConnuesRef.current = idsDemandesActuelles;
        nouvelles.forEach((d) => {
          showToast(`Nouvelle demande ${categorieLabel(d.categorie)} correspond à votre profil !`, () =>
            router.push(`/(prestataire)/demandes/${d.id}`)
          );
        });
      }

      const prestationParOffre = new Map(prestations.map((p) => [p.offreId, p]));
      setOffresAccepteesNonDemarrees(
        offres.filter(
          (o) => o.statut === OffreStatut.ACCEPTEE && prestationParOffre.get(o.id)?.statut === "confirmee"
        ).length
      );

      const statutsActuels = new Map(offres.map((o) => [o.id, o.statut]));
      if (statutsOffresConnusRef.current === null) {
        statutsOffresConnusRef.current = statutsActuels;
        return;
      }
      offres.forEach((o) => {
        const ancien = statutsOffresConnusRef.current!.get(o.id);
        if (!ancien || ancien === o.statut) return;
        if (o.statut === OffreStatut.ACCEPTEE) {
          showToast(`Votre offre pour ${categorieLabel(o.demande.categorie)} a été acceptée !`, () =>
            router.push({ pathname: "/(prestataire)/offres/prestation", params: { offreId: o.id } })
          );
        } else if (o.statut === OffreStatut.REFUSEE) {
          showToast(`Votre offre pour ${categorieLabel(o.demande.categorie)} a été refusée.`, () =>
            router.push(`/(prestataire)/offres/${o.id}`)
          );
        }
      });
      statutsOffresConnusRef.current = statutsActuels;
    };

    const tick = async () => {
      try {
        const user = await getStoredUser();
        if (!user || annule) return;
        if (user.role === UserRole.CLIENT) await tickClient();
        if (user.role === UserRole.PRESTATAIRE) await tickPrestataire(user);
      } catch {
        // silencieux — on retentera au prochain cycle
      }
    };

    tick();
    const interval = setInterval(tick, POLLING_MS);
    return () => {
      annule = true;
      clearInterval(interval);
    };
  }, [setOffresEnAttente, setDemandesSansOffre, setOffresAccepteesNonDemarrees, showToast, router]);

  return null;
}
