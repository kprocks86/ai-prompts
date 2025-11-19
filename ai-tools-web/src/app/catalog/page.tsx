import { CatalogExplorer } from "@/components/catalog-explorer";
import { slugify } from "@/lib/catalog";
import type { ResourceKind } from "@/types/resource";

type CatalogPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const ensureArray = (value: string | string[] | undefined) => {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const parseKinds = (value: string | string[] | undefined): ResourceKind[] => {
  const normalized = ensureArray(value).map((entry) => entry.toLowerCase());
  const set = new Set<ResourceKind>();
  normalized.forEach((entry) => {
    if (entry === "prompt" || entry === "tool") {
      set.add(entry);
    }
  });
  return Array.from(set);
};

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  const initialQuery =
    typeof searchParams?.q === "string"
      ? searchParams.q
      : typeof searchParams?.query === "string"
        ? searchParams.query
        : "";

  const initialCompanies = Array.from(
    new Set(ensureArray(searchParams?.company ?? searchParams?.companies).map((value) => slugify(value))),
  ).filter(Boolean);

  const initialTags = Array.from(
    new Set(ensureArray(searchParams?.tag ?? searchParams?.tags).map((tag) => tag.toLowerCase())),
  );

  const initialKinds = parseKinds(searchParams?.kind ?? searchParams?.kinds);

  const explorerKey = [initialQuery, initialCompanies.join("|"), initialKinds.join("|"), initialTags.join("|")].join(
    "::",
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3 pb-10">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Full catalog</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Searchable library of AI prompts & tools
        </h1>
        <p className="text-lg text-muted-foreground">
          Every entry is copied from the upstream GitHub repo so you can study prompt structure,
          tool wiring, and system message strategies without leaving the site.
        </p>
      </div>
      <CatalogExplorer
        key={explorerKey}
        initialQuery={initialQuery}
        initialCompanies={initialCompanies}
        initialKinds={initialKinds}
        initialTags={initialTags}
      />
    </section>
  );
}
