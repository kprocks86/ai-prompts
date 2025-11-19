"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyButton({ text, label = "Copy", className }: CopyButtonProps) {
  const [state, setState] = React.useState<"idle" | "copied">("idle");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setState("copied");
    setTimeout(() => setState("idle"), 1200);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleCopy}
    >
      {state === "copied" ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
      {state === "copied" ? "Copied" : label}
    </Button>
  );
}
