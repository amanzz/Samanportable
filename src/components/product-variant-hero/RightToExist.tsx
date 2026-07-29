import {
  getRightToExistEntry,
  getRightToExistHeadingId,
  hasRightToExistEntry,
} from './rightToExistEntries';

export { hasRightToExistEntry };

export default function RightToExist({ productSlug }: { productSlug: string }) {
  const entry = getRightToExistEntry(productSlug);
  if (!entry) return null;

  const headingId = getRightToExistHeadingId(productSlug);

  return (
    <section
      className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="mb-3 text-xl font-bold text-[var(--ds-color-forest)] sm:text-2xl"
      >
        {entry.heading}
      </h2>
      <p className="text-sm leading-relaxed text-slate-700">{entry.body}</p>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-800">
        {entry.comparison}
        {entry.appendix}
      </p>
    </section>
  );
}
