export function SectionHeading({label, title, description, children}: {label?: string; title: string; description?: string; children?: React.ReactNode}) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
    <div className="max-w-2xl">{label && <p className="mb-3 text-sm font-bold text-primary">{label}</p>}
      <h2 className="whitespace-pre-line text-3xl font-bold leading-snug md:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-7 text-muted-foreground">{description}</p>}
    </div>{children}
  </div>;
}
