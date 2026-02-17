"use client";

import { useTransition } from "react";

type Props = {
  status: string;
  action: (formData: FormData) => Promise<void>;
};

export default function BookingStatusButtons({ status, action }: Props) {
  const [pending, startTransition] = useTransition();

  function submit(next: "pending" | "confirmed" | "rejected") {
    const fd = new FormData();
    fd.set("status", next);
    startTransition(() => action(fd));
  }

  return (
    <div className="inline-flex flex-wrap justify-end gap-2">
      <button
        type="button"
        disabled={pending || status === "pending"}
        onClick={() => submit("pending")}
        className="rounded-md border px-3 py-1.5 text-xs hover:bg-neutral-50 disabled:opacity-50"
      >
        Pending
      </button>

      <button
        type="button"
        disabled={pending || status === "confirmed"}
        onClick={() => submit("confirmed")}
        className="rounded-md border px-3 py-1.5 text-xs hover:bg-neutral-50 disabled:opacity-50"
      >
        Confirm
      </button>

      <button
        type="button"
        disabled={pending || status === "rejected"}
        onClick={() => submit("rejected")}
        className="rounded-md border px-3 py-1.5 text-xs hover:bg-neutral-50 disabled:opacity-50"
      >
        Reject
      </button>

      {pending && <span className="text-xs text-neutral-500">...</span>}
    </div>
  );
}
