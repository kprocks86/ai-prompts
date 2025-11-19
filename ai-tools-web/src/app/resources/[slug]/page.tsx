import { notFound } from "next/navigation";

import Link from "next/link";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filterResources, getResourceBySlug, resources, slugify } from "@/lib/catalog";

export const dynamicParams = false;

export async function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const resource = getResourceBySlug(params.slug);
  if (!resource) return {};
  return {
    title: `${resource.title} · ${resource.company} prompt/tool`,
    description: resource.summary,
  };
}

type ResourcePageProps = {
  params: { slug: string };
};

export default function ResourcePage({ params }: ResourcePageProps) {
  const resource = getResourceBySlug(params.slug);
  if (!resource) {
    return notFound();
  }

  const related = filterResources({ companies: [slugify(resource.company)] })
    .filter((item) => item.id !== resource.id)
    .slice(0, 4);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3 pb-8">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">{resource.company}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {resource.title}
        </h1>
        <p className="text-lg text-muted-foreground">{resource.summary}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{resource.kind}</Badge>
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        <CopyButton text={resource.content} label={`Copy full ${resource.kind}`} className="w-full sm:w-auto" />
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Original content</CardTitle>
          <CardDescription>Copied directly from {resource.sourcePath}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] rounded-2xl border border-border/60 bg-muted/40 p-6">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-foreground">
              {resource.content}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>

      {related.length > 0 && (
        <div className="pt-12">
          <h2 className="text-2xl font-semibold tracking-tight">More from {resource.company}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <Card key={item.id} className="border-border/70">
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="px-0">
                    <Link href={`/resources/${item.slug}`}>Open detail</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
