export default function MockExamLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div>
        <div className="h-7 w-48 rounded bg-muted" />
        <div className="h-4 w-80 rounded bg-muted mt-2" />
      </div>
      <div className="rounded-lg border p-6 space-y-4">
        <div className="h-24 w-24 mx-auto rounded-full bg-muted" />
        <div className="h-6 w-64 mx-auto rounded bg-muted" />
        <div className="h-4 w-48 mx-auto rounded bg-muted" />
        <div className="h-10 w-40 mx-auto rounded bg-muted" />
      </div>
    </div>
  );
}
