import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import { clearTokens } from "@/services/api";

// ─── Lazy-loaded pages (code splitting) ─────────────────────────────────────
const Index = lazy(() => import("./pages/Index"));
const AIPlanner = lazy(() => import("./pages/AIPlanner"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ─── Loading fallback ────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-secondary" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  // Listen for session-expired event dispatched by the api.ts interceptor
  useEffect(() => {
    const handler = () => {
      clearTokens();
      // Clear backend tokens on session expiry
    };
    window.addEventListener("auth:session-expired", handler);
    return () => window.removeEventListener("auth:session-expired", handler);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ai-planner" element={<AIPlanner />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/explore" element={<ComingSoon />} />
                <Route path="/create-trip" element={<ComingSoon />} />
                <Route path="/dashboard" element={<ComingSoon />} />
                <Route path="/profile" element={<ComingSoon />} />
                <Route path="/profile/:userId" element={<ComingSoon />} />
                <Route path="/messages" element={<ComingSoon />} />
                <Route path="/messages/:conversationId" element={<ComingSoon />} />
                <Route path="/trip/:id" element={<ComingSoon />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
