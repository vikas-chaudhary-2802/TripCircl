import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import AIPlanner from "./pages/AIPlanner";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
