import Link from "next/link";
import { ArrowUpRight, Filter, Search, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { featuredCompanies, featuredResources, stats } from "@/lib/catalog";

const capabilityHighlights = [
  {
    title: "Full prompt fidelity",
    body: "Every system prompt and tool definition is copied locally so the site works offline and never relies on GitHub at runtime.",
  },
  {
    title: "Search & filters",
    body: "Instantly slice by company, tags, or prompt/tool type. Dark mode ready so it feels native alongside your IDE.",
  },
  {
    title: "Company first taxonomy",
    body: "Categories are organized by the team that authored the prompt so you can compare Anthropic vs OpenAI vs Replit at a glance.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24">
      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Live dataset · {stats.resources} resources and counting
        </div>
        <div className="grid gap-16 pt-10 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Systems prompts & AI tools curated for builders.
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Explore how top companies structure their copilots, agents, and
                workflows. Browse by company, tag, or modality with a theme
                designed specifically for shadcn/ui.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/catalog" className="flex items-center gap-2">
                  Explore catalog
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/companies">Browse companies</Link>
              </Button>
            </div>
            <div className="grid gap-6 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm sm:grid-cols-3">
              {[
                { label: "Companies", value: stats.companies },
                { label: "Prompts", value: stats.prompts },
                { label: "Tools", value: stats.tools },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-3xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Highlights
            </p>
            <div className="mt-6 space-y-8">
              {capabilityHighlights.map((item) => (
                <div key={item.title}>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Badge variant="secondary" className="gap-1">
                <Search className="h-3.5 w-3.5" /> instant search
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Filter className="h-3.5 w-3.5" /> filter by company
              </Badge>
              <Badge variant="secondary">Custom OKLCH theme</Badge>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Featured prompts & tools
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">What teams are shipping</h2>
          </div>
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/catalog">
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featuredResources.map((resource) => (
            <Card key={resource.id} className="h-full">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {resource.company}
                  </span>
                  <span className="text-xs uppercase">{resource.kind}</span>
                </div>
                <CardTitle className="text-2xl font-semibold leading-tight">
                  {resource.title}
                </CardTitle>
                <CardDescription>{resource.summary}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {resource.tags.slice(0, 6).map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button asChild variant="link" className="mt-4 px-0">
                  <Link href={`/resources/${resource.slug}`} className="gap-2">
                    Read detail
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="companies" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Categories by company
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Follow the teams behind the prompts
            </h2>
          </div>
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/companies">
              All companies
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredCompanies.map((company) => (
            <Card key={company.id} className="h-full border-border/70">
              <CardHeader>
                <CardTitle className="text-xl">{company.name}</CardTitle>
                <CardDescription>{company.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {company.resourceCount} resources · {company.primaryKinds.join(", ")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/companies#${company.slug}`}>View collection</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
