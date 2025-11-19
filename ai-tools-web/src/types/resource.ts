export type ResourceKind = "prompt" | "tool";

export type Resource = {
  id: string;
  slug: string;
  title: string;
  company: string;
  kind: ResourceKind;
  tags: string[];
  summary: string;
  content: string;
  sourcePath: string;
};

export type Company = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  resourceCount: number;
  primaryKinds: ResourceKind[];
};

export type FilterOption = {
  value: string;
  label: string;
  group: "company" | "tag" | "kind";
};
