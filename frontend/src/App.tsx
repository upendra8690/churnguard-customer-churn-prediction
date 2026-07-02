import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard.tsx";
import Landing from "./pages/landing.tsx";

const queryClient = new QueryClient();

export default function App() {
  const [showApp, setShowApp] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      {showApp ? <Dashboard /> : <Landing onEnter={() => setShowApp(true)} />}
    </QueryClientProvider>
  );
}