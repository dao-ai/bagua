interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center pb-6">
      <h2 className="text-[26px] mb-1.5 font-heading leading-relaxed">{title}</h2>
      {subtitle && (
        <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}
