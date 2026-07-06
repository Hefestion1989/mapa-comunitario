import type { Resource } from "./types";

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function matchesResource(resource: Resource, query: string): boolean {
  const normalizedQuery = normalizeText(query.trim());
  if (!normalizedQuery) return true;
  const haystack = normalizeText(
    [
      resource.name,
      resource.organization,
      resource.scope,
      resource.notes,
      resource.referral,
      resource.category,
      ...resource.audience,
      ...resource.situations,
    ].join(" "),
  );
  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => haystack.includes(part));
}

export function buildReferralText(resource: Resource): string {
  const lines = [
    resource.referral,
    resource.phone ? `Telefono: ${resource.phone}` : "",
    resource.whatsapp ? `WhatsApp / marcacion corta: ${resource.whatsapp}` : "",
    resource.website ? `Web: ${resource.website}` : "",
    `Fuente: ${resource.sourceName} (${resource.sourceUrl})`,
    `Verificado: ${resource.verifiedAt}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export function classNames(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(" ");
}
