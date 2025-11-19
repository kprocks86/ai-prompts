"use client";

import { ArrowUpRight, Copy } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Resource } from "@/types/resource";

export type ResourceCardProps = {
  resource: Resource;
  showExcerpt?: boolean;
};

export function ResourceCard({ resource, showExcerpt = true }: ResourceCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resource.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Card className="h-full border-border/70">
      <CardHeader className="pb-0">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-foreground">
            {resource.company}
          </span>
          <span>{resource.kind}</span>
        </div>
        <CardTitle className="text-2xl font-semibold leading-tight">
          {resource.title}
        </CardTitle>
        {showExcerpt && <CardDescription>{resource.summary}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-2">
          {resource.tags.slice(0, 6).map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">{resource.sourcePath}</div>
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            {copied ? "Copied" : "Copy prompt"}
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link href={`/resources/${resource.slug}`}>
              Open detail
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
