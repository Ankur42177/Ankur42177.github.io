// A quiet aurora behind every page: three blurred blobs drifting slowly (pure CSS, see globals.css),
// a faint grid that fades out, and a cursor spotlight driven by CardFx.
export default function AmbientBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <i />
      <i />
      <i />
      <div className="grid-fade" />
    </div>
  );
}
