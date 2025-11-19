import type { ResourceKind } from "@/types/resource";

export type ColumnType =
  | "text"
  | "integer"
  | "uuid"
  | "boolean"
  | "timestamp"
  | "jsonb";

type Column = {
  name: string;
  type: ColumnType;
  nullable?: boolean;
  unique?: boolean;
  defaultValue?: string;
  description?: string;
};

type Table = {
  name: string;
  primaryKey: string;
  columns: Column[];
  relationships?: { table: string; column: string; references: string }[];
};

export type DatabaseSchema = {
  tables: Table[];
};

export const schema: DatabaseSchema = {
  tables: [
    {
      name: "companies",
      primaryKey: "id",
      columns: [
        { name: "id", type: "uuid", description: "Stable company id" },
        { name: "name", type: "text", unique: true, description: "Display name" },
        { name: "slug", type: "text", unique: true, description: "URL safe identifier" },
        {
          name: "summary",
          type: "text",
          nullable: true,
          description: "Short description pulled from the strongest prompt/tool",
        },
        {
          name: "primary_kinds",
          type: "jsonb",
          description: "Array<ResourceKind> showing whether the company has prompts, tools, or both",
        },
        {
          name: "tag_vector",
          type: "jsonb",
          description: "List of normalized tags that power category browsing",
        },
        {
          name: "resource_count",
          type: "integer",
          defaultValue: "0",
          description: "Denormalized count used for stats on the landing page",
        },
      ],
    },
    {
      name: "resources",
      primaryKey: "id",
      columns: [
        { name: "id", type: "uuid", description: "Stable resource id" },
        { name: "company_id", type: "uuid", description: "FK to companies.id" },
        { name: "slug", type: "text", unique: true, description: "URL safe slug" },
        { name: "title", type: "text" },
        {
          name: "kind",
          type: "text",
          description: 'ResourceKind union ("prompt" | "tool") kept as ENUM in the DB',
        },
        { name: "summary", type: "text", nullable: true },
        { name: "content", type: "text", description: "Full prompt or tool instructions" },
        {
          name: "source_path",
          type: "text",
          description: "Original path inside the upstream repo for attribution",
        },
        {
          name: "metadata",
          type: "jsonb",
          description: "Any extra structured fields such as pricing, links, or supported models",
        },
        {
          name: "created_at",
          type: "timestamp",
          defaultValue: "now()",
        },
        {
          name: "updated_at",
          type: "timestamp",
          defaultValue: "now()",
        },
      ],
      relationships: [
        {
          table: "companies",
          column: "company_id",
          references: "companies.id",
        },
      ],
    },
    {
      name: "tags",
      primaryKey: "id",
      columns: [
        { name: "id", type: "uuid" },
        { name: "value", type: "text", unique: true },
        {
          name: "kind",
          type: "text",
          description: 'Derived grouping such as "company", "topic", or "kind"',
        },
      ],
    },
    {
      name: "resource_tags",
      primaryKey: "id",
      columns: [
        { name: "id", type: "uuid" },
        { name: "resource_id", type: "uuid" },
        { name: "tag_id", type: "uuid" },
      ],
      relationships: [
        { table: "resources", column: "resource_id", references: "resources.id" },
        { table: "tags", column: "tag_id", references: "tags.id" },
      ],
    },
    {
      name: "search_filters",
      primaryKey: "id",
      columns: [
        { name: "id", type: "uuid" },
        { name: "label", type: "text" },
        { name: "group", type: "text", description: 'company | tag | kind' },
        { name: "value", type: "text" },
        { name: "payload", type: "jsonb", nullable: true },
      ],
    },
    {
      name: "user_preferences",
      primaryKey: "id",
      columns: [
        { name: "id", type: "uuid" },
        { name: "user_id", type: "uuid", description: "FK to users (future)" },
        {
          name: "dark_mode",
          type: "boolean",
          defaultValue: "true",
          description: "Persisted dark mode toggle",
        },
        {
          name: "saved_filters",
          type: "jsonb",
          nullable: true,
          description: "Last-used filters to hydrate the catalog UI",
        },
      ],
    },
  ],
};

export type SupportedResourceKind = ResourceKind;
