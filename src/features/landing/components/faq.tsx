"use client";

import { useState } from "react";
import { FAQS } from "../data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q} className="overflow-hidden rounded-2xl border border-hair bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-ink transition-colors hover:bg-surface/40"
            >
              {faq.q}
              <span
                className={`shrink-0 text-lg text-brand transition-transform ${isOpen ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-ink-soft">{faq.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
