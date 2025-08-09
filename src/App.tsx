import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Authentication from "./pages/Authentication";
import PersonaManager from "./pages/PersonaManager";
import DeviceProfiles from "./pages/DeviceProfiles";
import SessionReplayer from "./pages/SessionReplayer";
import CookieManager from "./pages/CookieManager";
import ProxyManager from "./pages/ProxyManager";
import Scheduler from "./pages/Scheduler";
import AITrainer from "./pages/AITrainer";
import ScriptHub from "./pages/ScriptHub";
import CampaignBuilder from "./pages/referrals/CampaignBuilder";
import TaskEngine from "./pages/referrals/TaskEngine";
import TaskEnginePage from "./pages/TaskEngine";
import Analytics from "./pages/referrals/Analytics";
import AITraining from "./pages/referrals/AITraining";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import RunDetails from "./pages/RunDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Authentication />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/personas" element={<PersonaManager />} />
                    <Route path="/device-profiles" element={<DeviceProfiles />} />
                    <Route path="/sessions" element={<SessionReplayer />} />
                    <Route path="/cookies" element={<CookieManager />} />
                    <Route path="/proxies" element={<ProxyManager />} />
                    <Route path="/scheduler" element={<Scheduler />} />
                    <Route path="/ai-trainer" element={<AITrainer />} />
                    <Route path="/scripts" element={<ScriptHub />} />
                    <Route path="/referrals/campaigns" element={<CampaignBuilder />} />
                    <Route path="/referrals/tasks" element={<TaskEngine />} />
            <Route path="/task-engine" element={<TaskEnginePage />} />
                    <Route path="/referrals/analytics" element={<Analytics />} />
                    <Route path="/referrals/ai-training" element={<AITraining />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/runs/:id" element={<RunDetails />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
