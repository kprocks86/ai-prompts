import { resources } from "@/data/resources";
import type { Company, FilterOption, Resource, ResourceKind } from "@/types/resource";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const companyMap = new Map<string, Company>();

resources.forEach((resource) => {
  const slug = slugify(resource.company);
  const existing = companyMap.get(slug);
  const summaryCandidate = resource.summary !== "No summary provided." ? resource.summary : existing?.summary;

  if (!existing) {
    companyMap.set(slug, {
      id: slug,
      slug,
      name: resource.company,
      summary: summaryCandidate ?? resource.summary,
      tags: Array.from(new Set(resource.tags)),
      resourceCount: 1,
      primaryKinds: [resource.kind],
    });
    return;
  }

  existing.resourceCount += 1;
  existing.tags = Array.from(new Set([...existing.tags, ...resource.tags]));
  if (!existing.primaryKinds.includes(resource.kind)) {
    existing.primaryKinds.push(resource.kind);
  }
  if (
    summaryCandidate &&
    (existing.summary === "No summary provided." || summaryCandidate.length < existing.summary.length)
  ) {
    existing.summary = summaryCandidate;
  }
});

export const companies = Array.from(companyMap.values()).sort((a, b) =>
  b.resourceCount === a.resourceCount
    ? a.name.localeCompare(b.name)
    : b.resourceCount - a.resourceCount,
);

export const kindFilters: FilterOption[] = ["prompt", "tool"].map((value) => ({
  value,
  label: value === "prompt" ? "Prompts" : "Tools",
  group: "kind",
}));

export const companyFilters: FilterOption[] = companies.map((company) => ({
  value: company.slug,
  label: company.name,
  group: "company",
}));

export const tagFilters: FilterOption[] = Array.from(
  new Set(resources.flatMap((resource) => resource.tags)),
)
  .sort((a, b) => a.localeCompare(b))
  .map((value) => ({
    value,
    label: value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    group: "tag",
  }));

export const stats = {
  resources: resources.length,
  prompts: resources.filter((resource) => resource.kind === "prompt").length,
  tools: resources.filter((resource) => resource.kind === "tool").length,
  companies: companies.length,
};

const prioritizedTags = ["agent", "tooling", "code", "design"];

export const featuredResources = (() => {
  const prioritized = resources.filter((resource) =>
    resource.tags.some((tag) => prioritizedTags.includes(tag)),
  );
  const remaining = resources.filter((resource) => !prioritized.includes(resource));
  return [...prioritized, ...remaining].slice(0, 8);
})();

export const featuredCompanies = companies.slice(0, 6);

export const allTags = tagFilters.map((tag) => tag.value);

export type ResourceFilters = {
  query?: string;
  companies?: string[];
  kinds?: ResourceKind[];
  tags?: string[];
};

export const filterResources = ({
  query,
  companies: selectedCompanies,
  kinds,
  tags,
}: ResourceFilters): Resource[] => {
  return resources.filter((resource) => {
    const matchesQuery = query
      ? [resource.title, resource.company, resource.summary, resource.tags.join(" ")]
          .join("\n")
          .toLowerCase()
          .includes(query.toLowerCase())
      : true;

    const matchesCompany = selectedCompanies?.length
      ? selectedCompanies.includes(slugify(resource.company))
      : true;

    const matchesKind = kinds?.length ? kinds.includes(resource.kind) : true;

    const matchesTag = tags?.length
      ? tags.every((tag) => resource.tags.map((value) => value.toLowerCase()).includes(tag.toLowerCase()))
      : true;

    return matchesQuery && matchesCompany && matchesKind && matchesTag;
  });
};

export const getResourceBySlug = (slug: string) =>
  resources.find((resource) => resource.slug === slug);

export const getCompanyBySlug = (slug: string) =>
  companies.find((company) => company.slug === slug);
