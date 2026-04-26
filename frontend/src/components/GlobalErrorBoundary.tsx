import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  // If the error is related to failing to load a chunk (e.g., dev server restarted/stopped or new deployment)
  const isChunkError = error.message.toLowerCase().includes("failed to fetch dynamically imported module");

  if (isChunkError) {
    // Automatically reload the page once for chunk errors
    window.location.reload();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <ShieldAlert className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Oops, something went wrong!</h2>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        {isChunkError 
          ? "We've updated the application. Please refresh the page."
          : "An unexpected error occurred. Please try again or return home."}
      </p>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Return Home
        </Button>
        <Button onClick={resetErrorBoundary}>
          Try Again
        </Button>
      </div>

      {!isChunkError && process.env.NODE_ENV === "development" && (
        <div className="mt-12 max-w-2xl text-left">
          <p className="mb-2 text-xs font-bold text-destructive uppercase tracking-wider">Error Details (Dev Only)</p>
          <pre className="overflow-auto rounded-lg bg-black/90 p-4 text-xs text-red-400 font-mono w-full max-h-[300px]">
            {error.message}
            <br />
            {error.stack}
          </pre>
        </div>
      )}
    </div>
  );
}

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
