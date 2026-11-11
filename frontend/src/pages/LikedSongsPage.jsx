import PageLayout from '../components/PageLayout.jsx'

export default function LikedSongsPage() {
  return <PageLayout eyebrow="Your collection" title="Liked Songs" description="Songs you like will appear here in a later phase.">
    <div className="placeholder-panel liked-panel"><span className="panel-icon" aria-hidden="true">♥</span><div><strong>Made for your favorites</strong><p>Liked Songs placeholder</p></div></div>
  </PageLayout>
}
