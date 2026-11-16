export default function CatalogStatus({ status, error }) {
  if (status === 'loading') return <p className="catalog-status" role="status">Loading the music catalog…</p>
  if (status === 'error') return <p className="catalog-status catalog-error" role="alert">Could not load the music catalog. {error}</p>
  return null
}
