export default function WorkspaceSessionLoading() {
  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col bg-muted/30">
        <div className="h-14 shrink-0 border-b bg-background" />

        <div className="flex-1 overflow-hidden p-6">
          <div
            className="mx-auto w-fit animate-pulse rounded-sm border border-border bg-card"
            style={{ width: 720, height: 932 }}
          />
        </div>
      </div>

      <div className="flex h-full min-h-0 w-96 min-w-96 shrink-0 flex-col gap-3 border-l bg-sidebar p-4">
        <div className="h-7 w-44 shrink-0 animate-pulse rounded bg-secondary/20" />
        <div className="min-h-0 flex-1 animate-pulse rounded-lg bg-secondary/10" />
        <div className="h-20 shrink-0 animate-pulse rounded-lg bg-secondary/20" />
      </div>
    </>
  );
}
