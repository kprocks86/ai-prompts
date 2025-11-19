import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Company } from "@/types/resource";

type CompanyCardProps = {
  company: Company;
};

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card id={company.slug} className="h-full border-border/70">
      <CardHeader>
        <CardTitle className="text-xl">{company.name}</CardTitle>
        <CardDescription>{company.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {company.resourceCount} resources · {company.primaryKinds.join(", ")}
        </div>
        <div className="flex flex-wrap gap-2">
          {company.tags.slice(0, 6).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/catalog?company=${company.slug}`}>Filter catalog</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
