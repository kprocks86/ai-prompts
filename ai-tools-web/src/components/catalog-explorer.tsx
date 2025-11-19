"use client";

import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";

import { ResourceCard } from "@/components/resource-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  companyFilters,
  filterResources,
  kindFilters,
  tagFilters,
} from "@/lib/catalog";
import type { ResourceKind } from "@/types/resource";

export function CatalogExplorer() {
  const [query, setQuery] = useState("");
  const [kinds, setKinds] = useState<ResourceKind[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      filterResources({
        query,
        kinds,
        companies,
        tags,
      }),
    [query, kinds, companies, tags],
  );

  const toggleKind = (kind: ResourceKind) => {
    setKinds((prev) =>
      prev.includes(kind) ? prev.filter((item) => item !== kind) : [...prev, kind],
    );
  };

  const toggleValue = (
    value: string,
    setFn: Dispatch<SetStateAction<string[]>>,
  ) => {
    setFn((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const clearAll = () => {
    setQuery("");
    setKinds([]);
    setCompanies([]);
    setTags([]);
  };

  const hasFilters = query.length > 0 || kinds.length > 0 || companies.length > 0 || tags.length > 0;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts, tools, companies, tags"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-10"
              type="search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {kindFilters.map((kind) => (
              <Toggle
                key={kind.value}
                pressed={kinds.includes(kind.value as ResourceKind)}
                onPressedChange={() => toggleKind(kind.value as ResourceKind)}
                className="capitalize"
              >
                {kind.label}
              </Toggle>
            ))}
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Companies
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Select companies</DropdownMenuLabel>
              {companyFilters.map((company) => (
                <DropdownMenuCheckboxItem
                  key={company.value}
                  checked={companies.includes(company.value)}
                  onCheckedChange={() => toggleValue(company.value, setCompanies)}
                >
                  {company.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Tags
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
              {tagFilters.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.value}
                  checked={tags.includes(tag.value)}
                  onCheckedChange={() => toggleValue(tag.value, setTags)}
                >
                  {tag.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="gap-2 text-muted-foreground">
              <X className="h-4 w-4" /> Clear filters
            </Button>
          )}
        </div>

        {hasFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {kinds.map((kind) => (
              <Badge key={kind} variant="secondary" className="gap-1">
                {kind}
                <button
                  type="button"
                  onClick={() => toggleKind(kind)}
                  aria-label={`Remove ${kind}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {companies.map((company) => (
              <Badge key={company} variant="secondary" className="gap-1">
                {companyFilters.find((item) => item.value === company)?.label ?? company}
                <button
                  type="button"
                  onClick={() => toggleValue(company, setCompanies)}
                  aria-label={`Remove ${company}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tagFilters.find((item) => item.value === tag)?.label ?? tag}
                <button
                  type="button"
                  onClick={() => toggleValue(tag, setTags)}
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> curated resources
        </p>
        {hasFilters && <p>Filters applied</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            No resources match that combination yet. Try removing a filter.
          </div>
        ) : (
          filtered.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
        )}
      </div>
    </div>
  );
}
