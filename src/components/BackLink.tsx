import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="-ml-2 mt-2 inline-flex h-11 items-center gap-1 rounded px-2 font-semibold text-muted hover:text-ink md:mt-8">
      <ChevronLeft size={18} aria-hidden />
      {children}
    </Link>
  );
}
