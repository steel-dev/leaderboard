import { getAllBenchmarkPages, type BenchmarkResultRow } from "./benchmark-hub";
import registry from "../data/entities.json";

export interface ProfileResult {
  benchmarkSlug: string;
  benchmarkName: string;
  row: BenchmarkResultRow;
}
export interface EntityProfile {
  id: string;
  name: string;
  kind: "system" | "organization";
  organization?: string;
  results: ProfileResult[];
}

const organizationAliases: Record<string, string> = { "Browser-Use": "Browser Use" };
const genericOrganizations = new Set(["Academic Research", "Independent Research", "Independent"]);
export const canonicalOrganization = (name: string): string => organizationAliases[name] ?? name;
const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const allResults: ProfileResult[] = getAllBenchmarkPages().flatMap((page) =>
  page.results.map((row) => ({ benchmarkSlug: page.meta.slug, benchmarkName: page.meta.name, row }))
);

// Exact aliases preserve configuration variants and scaffold names.
export const systemProfiles: EntityProfile[] = registry.systems
  .map((entity) => ({
    id: entity.id,
    name: entity.name,
    kind: "system",
    organization: entity.organization,
    results: allResults.filter(
      ({ row }) =>
        canonicalOrganization(row.organization) === canonicalOrganization(entity.organization) &&
        entity.aliases.includes(row.systemName)
    ),
  }))
  .filter((profile) => profile.results.length >= 2);

const organizations = [
  ...new Set(allResults.map(({ row }) => canonicalOrganization(row.organization))),
];
export const organizationProfiles: EntityProfile[] = organizations
  .filter((name) => !genericOrganizations.has(name))
  .map((name) => ({
    id: slugify(name),
    name,
    kind: "organization",
    results: allResults.filter(({ row }) => canonicalOrganization(row.organization) === name),
  }))
  .filter((profile) => profile.results.length >= 2);

for (const profiles of [systemProfiles, organizationProfiles]) {
  if (new Set(profiles.map((profile) => profile.id)).size !== profiles.length) {
    throw new Error(
      "Duplicate entity profile ID. Assign distinct stable IDs in the entity registry."
    );
  }
}

export function getSystemProfile(row: BenchmarkResultRow) {
  const entity = registry.systems.find(
    (entry) =>
      canonicalOrganization(entry.organization) === canonicalOrganization(row.organization) &&
      entry.aliases.includes(row.systemName)
  );
  return entity ? systemProfiles.find((profile) => profile.id === entity.id) : undefined;
}
export function getOrganizationProfile(name: string) {
  return organizationProfiles.find((profile) => profile.name === canonicalOrganization(name));
}
export function profileUrl(profile: EntityProfile) {
  return `/${profile.kind === "system" ? "models" : "companies"}/${profile.id}/`;
}
