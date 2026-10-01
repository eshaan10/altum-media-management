/** Small editorial label, e.g. "(01) About". */
export default function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <p className="flex items-baseline gap-2 text-sm font-medium tracking-wide text-steel">
      <span className="tabular-nums">({index})</span>
      <span className="uppercase">{children}</span>
    </p>
  );
}
