export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Greeting Section */}
      <div className="flex items-center gap-6">
        <div className="h-32 w-32 rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-7 w-64 rounded bg-muted" />
          <div className="h-4 w-48 rounded bg-muted" />
        </div>
      </div>

      {/* Component Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
            <div className="h-2 w-full rounded bg-muted" />
            <div className="h-9 w-full rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <div className="h-9 w-24 rounded bg-muted" />
        <div className="h-9 w-32 rounded bg-muted" />
      </div>
    </div>
  );
}
