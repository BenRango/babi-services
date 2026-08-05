import { createContext, useContext, useState } from "react";

interface NotificationsBadgeValue {
  /** Client — offres en_attente sur ses demandes (tab Demande). */
  offresEnAttente: number;
  /** Prestataire — demandes ouvertes correspondant au profil, pas encore proposées (tab Demandes). */
  demandesSansOffre: number;
  /** Prestataire — offres acceptées mais prestation pas encore démarrée (tab Offres). */
  offresAccepteesNonDemarrees: number;
  setOffresEnAttente: (n: number) => void;
  setDemandesSansOffre: (n: number) => void;
  setOffresAccepteesNonDemarrees: (n: number) => void;
}

const NotificationsBadgeContext = createContext<NotificationsBadgeValue | null>(null);

export function NotificationsBadgeProvider({ children }: { children: React.ReactNode }) {
  const [offresEnAttente, setOffresEnAttente] = useState(0);
  const [demandesSansOffre, setDemandesSansOffre] = useState(0);
  const [offresAccepteesNonDemarrees, setOffresAccepteesNonDemarrees] = useState(0);

  return (
    <NotificationsBadgeContext.Provider
      value={{
        offresEnAttente,
        demandesSansOffre,
        offresAccepteesNonDemarrees,
        setOffresEnAttente,
        setDemandesSansOffre,
        setOffresAccepteesNonDemarrees,
      }}
    >
      {children}
    </NotificationsBadgeContext.Provider>
  );
}

export function useNotificationsBadge(): NotificationsBadgeValue {
  const ctx = useContext(NotificationsBadgeContext);
  if (!ctx) throw new Error("useNotificationsBadge doit être utilisé dans NotificationsBadgeProvider");
  return ctx;
}
