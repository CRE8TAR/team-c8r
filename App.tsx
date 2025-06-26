import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Mint from "./pages/Mint";
import Buy from "./pages/Buy";
import Companion from "./pages/Companion";
import Fusion from "./pages/Fusion";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import StakeGovernance from "./pages/StakeGovernance";
import EarnC8R from "./pages/EarnC8R";
import Whitepaper from "./pages/Whitepaper";
import NotFound from "./pages/NotFound";
import "./App.css";
import { DiscoverWalletProviders } from "./components/WalletProviders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DiscoverWalletProviders />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/companion" element={<Companion />} />
            <Route path="/fusion" element={<Fusion />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/stake" element={<StakeGovernance />} />
            <Route path="/governance" element={<StakeGovernance />} />
            <Route path="/earn" element={<EarnC8R />} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
