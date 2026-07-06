export type Category =
  | "salud-mental"
  | "violencia"
  | "calle"
  | "consumo"
  | "trabajo"
  | "educacion"
  | "emergencia"
  | "tramites";

export type Urgency = "emergencia" | "alta" | "media" | "orientacion";

export type Resource = {
  id: string;
  name: string;
  organization: string;
  category: Category;
  urgency: Urgency;
  scope: string;
  audience: string[];
  situations: string[];
  phone?: string;
  whatsapp?: string;
  website?: string;
  hours?: string;
  notes: string;
  referral: string;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type LocalNote = {
  resourceId: string;
  text: string;
  updatedAt: string;
};
