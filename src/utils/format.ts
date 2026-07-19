export function formatFcfa(amount: number): string {
  const digits = Math.round(amount).toString().split("").reverse();
  const grouped: string[] = [];
  digits.forEach((digit, i) => {
    if (i > 0 && i % 3 === 0) grouped.push(" ");
    grouped.push(digit);
  });
  return `${grouped.reverse().join("")} FCFA`;
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
