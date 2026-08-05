export function apercuDescription(demande: { description?: string | null; audioUrl?: string | null }): string {
  const texte = demande.description?.trim();
  if (texte) return demande.audioUrl ? `🎤 ${texte}` : texte;
  if (demande.audioUrl) return "🎤 Note vocale";
  return "Sans description";
}

export function apercuMessage(offre: { message?: string | null; messageAudioUrl?: string | null }): string {
  const texte = offre.message?.trim();
  if (texte) return offre.messageAudioUrl ? `🎤 ${texte}` : texte;
  if (offre.messageAudioUrl) return "🎤 Message vocal";
  return "Sans message";
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
