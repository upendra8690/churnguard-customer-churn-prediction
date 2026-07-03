import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard.tsx";
import Landing from "./pages/landing.tsx";

const queryClient = new QueryClient();

export default function App() {
  const [showApp, setShowApp] = useState(() => window.location.pathname.startsWith("/dashboard"));

  useEffect(() => {
    const onPop = () => setShowApp(window.location.pathname.startsWith("/dashboard"));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function enterDashboard() {
    window.history.pushState({}, "", "/dashboard");
    setShowApp(true);
  }

  return (
    <QueryClientProvider client={queryClient}>
      {showApp ? <Dashboard /> : <Landing onEnter={enterDashboard} />}
    </QueryClientProvider>
  );
}