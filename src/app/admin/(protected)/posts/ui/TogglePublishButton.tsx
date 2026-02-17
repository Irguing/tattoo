"use client";
import { useTransition } from "react";

export default function TogglePublishButton({
  label,
  action,
}: {
  label: string;
  action: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button" // ✅ CRÍTICO
      disabled={pending}
      onClick={() => startTransition(action)}
      className="rounded-md border px-3 py-1.5 text-xs hover:bg-neutral-50 disabled:opacity-50"
    >
      {pending ? "..." : label}
    </button>
  );
}
