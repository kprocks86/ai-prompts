import { CompanyCard } from "@/components/company-card";
import { Badge } from "@/components/ui/badge";
import { companies, stats } from "@/lib/catalog";

export default function CompaniesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3 pb-10">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Companies</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {stats.companies} teams publishing public system prompts & tools
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse companies like Anthropic, Replit, Cursor, and more. Each tile links directly into the
          catalog so you can filter down to a single author.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full">Prompts</Badge>
          <Badge variant="outline" className="rounded-full">Tools</Badge>
          <Badge variant="outline" className="rounded-full">Agents</Badge>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
}
