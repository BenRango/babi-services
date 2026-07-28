export interface CommuneMeta {
  id: string;
  label: string;
}

export const COMMUNES_ABIDJAN: CommuneMeta[] = [
  { id: "abobo", label: "Abobo" },
  { id: "adjame", label: "Adjamé" },
  { id: "attecoube", label: "Attécoubé" },
  { id: "bingerville", label: "Bingerville" },
  { id: "abatta", label: "Abatta" },
  { id: "cocody", label: "Cocody" },
  { id: "koumassi", label: "Koumassi" },
  { id: "marcory", label: "Marcory" },
  { id: "plateau", label: "Plateau" },
  { id: "port-bouet", label: "Port-Bouët" },
  { id: "treichville", label: "Treichville" },
  { id: "yopougon", label: "Yopougon" },
];

export function communeLabel(id: string): string {
  return COMMUNES_ABIDJAN.find((c) => c.id === id)?.label ?? id;
}
