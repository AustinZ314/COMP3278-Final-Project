export default function PageLayout({ eyebrow, title, description, children }) {
  return (
    <div className="page-layout">
      <div className="page-header">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {children}
    </div>
  )
}
