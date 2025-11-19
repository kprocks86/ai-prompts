import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p>
          Built with ❤️ using Next.js + shadcn/ui. Data sourced from the
          curated prompts & tools archive.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools"
            className="underline-offset-4 hover:underline"
            target="_blank"
          >
            Upstream Repository
          </Link>
          <Link
            href="https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools/issues"
            className="underline-offset-4 hover:underline"
            target="_blank"
          >
            Contribute
          </Link>
        </div>
      </div>
    </footer>
  );
}
