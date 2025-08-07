import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import PersonaManager from "./pages/PersonaManager";
import SessionReplayer from "./pages/SessionReplayer";
import ReferralTasks from "./pages/ReferralTasks";
import ProxyManager from "./pages/ProxyManager";
import DeviceSpoofing from "./pages/DeviceSpoofing";
import AITrainer from "./pages/AITrainer";
import Scheduler from "./pages/Scheduler";
import CookieManager from "./pages/CookieManager";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/personas" element={<PersonaManager />} />
            <Route path="/sessions" element={<SessionReplayer />} />
            <Route path="/referrals" element={<ReferralTasks />} />
            <Route path="/proxies" element={<ProxyManager />} />
            <Route path="/devices" element={<DeviceSpoofing />} />
            <Route path="/ai-trainer" element={<AITrainer />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/cookies" element={<CookieManager />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
