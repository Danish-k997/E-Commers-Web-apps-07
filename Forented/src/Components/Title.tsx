type TitleProps = {
  title: string
  subtitle?: string
  accentColor?: string
}

const Title = ({ title, subtitle, accentColor = "#F97316" }: TitleProps) => (
  <div className="text-center mb-12">
    <p className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-3">
      {subtitle || "Featured Collection"}
    </p>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
      {title}
    </h2>
    <div
      className="mx-auto h-1.5 w-20 rounded-full shadow-sm"
      style={{ background: accentColor }}
    />
  </div>
)

export default Title

