import { TypeDescription } from "@/types/demande";

export function apercuDescription(demande: { typeDescription: TypeDescription; description?: string }): string {
  if (demande.typeDescription === TypeDescription.AUDIO) return "🎤 Note vocale";
  return demande.description?.trim() || "Sans description";
}

export function formatFcfa(amount: number): string {
  const digits = Math.round(amount).toString().split("").reverse();
  const grouped: string[] = [];
  digits.forEach((digit, i) => {
    if (i > 0 && i % 3 === 0) grouped.push(" ");
    grouped.push(digit);
  });
  return `${grouped.reverse().join("")} FCFA`;
}

export function formatDelai(delaiMinutes: number): string {
  if (delaiMinutes <= 20) return "Dès maintenant";
  if (delaiMinutes < 60) return `Dans ${delaiMinutes} min`;
  const heures = Math.round(delaiMinutes / 60);
  if (heures === 1) return "Dans 1h";
  if (heures < 6) return `Dans ${heures}h`;
  return "Cet après-midi";
}

export function formatDateRelative(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH} h`;
  const diffJ = Math.floor(diffH / 24);
  return `Il y a ${diffJ} j`;
}
