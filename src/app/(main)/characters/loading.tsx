export default function CharactersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-48 rounded bg-muted" />
        <div className="h-4 w-72 rounded bg-muted mt-2" />
        <div className="h-3 w-24 rounded bg-muted mt-2" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="h-4 w-48 rounded bg-muted" />
            <div className="h-40 w-full rounded bg-muted" />
            <div className="h-9 w-full rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
