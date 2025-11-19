import { CatalogExplorer } from "@/components/catalog-explorer";

export default function CatalogPage() {
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
      <CatalogExplorer />
    </section>
  );
}
