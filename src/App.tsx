import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import BinScan from "./pages/BinScan";
import ItemScan from "./pages/ItemScan";
import PutawaySuccess from "./pages/PutawaySuccess";
import TakeAway from "./pages/TakeAway";
import TakeAwaySuccess from "./pages/TakeAwaySuccess";
import PickList from "./pages/PickList";
import PickListSuccess from "./pages/PickListSuccess";
import BinCount from "./pages/BinCount";
import BinCountSuccess from "./pages/BinCountSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bin-scan" element={<BinScan />} />
          <Route path="/item-scan" element={<ItemScan />} />
          <Route path="/putaway-success" element={<PutawaySuccess />} />
          <Route path="/takeaway" element={<TakeAway />} />
          <Route path="/takeaway-success" element={<TakeAwaySuccess />} />
          <Route path="/picklist" element={<PickList />} />
          <Route path="/picklist-success" element={<PickListSuccess />} />
          <Route path="/bincount" element={<BinCount />} />
          <Route path="/bincount-success" element={<BinCountSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
