import { useState, useEffect, useRef } from "react";
import { RefreshCw, ChevronDown, Check, Sun, Moon, Printer } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const INTERVAL_OPTIONS = [
  { label: "Every 5 min", ms: 5 * 60 * 1000 },
  { label: "Every 15 min", ms: 15 * 60 * 1000 },
  { label: "Every 1 hour", ms: 60 * 60 * 1000 },
  { label: "Every 24 hours", ms: 24 * 60 * 60 * 1000 },
];

export function DashboardControls({
  isDark,
  setIsDark,
  loading,
}: {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [autoRefreshMs, setAutoRefreshMs] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) {
      setIsSpinning(true);
    } else {
      const t = setTimeout(() => setIsSpinning(false), 600);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (autoRefreshMs !== null) {
      const interval = setInterval(() => {
        queryClient.invalidateQueries();
      }, autoRefreshMs);
      return () => clearInterval(interval);
    }
  }, [autoRefreshMs, queryClient]);

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <div className="flex items-center gap-3 pt-2 print:hidden">
      <div
        className="relative flex items-center rounded-[6px] overflow-visible h-[26px] text-[12px]"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
          color: isDark ? "#c8c9cc" : "#4b5563",
        }}
        ref={dropdownRef}
      >
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1 px-2 h-full rounded-l-[6px] hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
          Refresh
        </button>
        <div
          className="w-px h-4 shrink-0"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}
        />
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center justify-center px-1.5 h-full rounded-r-[6px] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-popover border shadow-md rounded-md z-50 py-1 text-popover-foreground text-[13px]">
            <div className="px-3 py-1.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
              Auto-refresh
            </div>
            <button
              className="w-full text-left px-3 py-1.5 hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
              onClick={() => {
                setAutoRefreshMs(null);
                setDropdownOpen(false);
              }}
            >
              Off
              {autoRefreshMs === null && <Check className="w-4 h-4" />}
            </button>
            {INTERVAL_OPTIONS.map((opt) => (
              <button
                key={opt.ms}
                className="w-full text-left px-3 py-1.5 hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
                onClick={() => {
                  setAutoRefreshMs(opt.ms);
                  setDropdownOpen(false);
                }}
              >
                {opt.label}
                {autoRefreshMs === opt.ms && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => window.print()}
        disabled={loading}
        className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors disabled:opacity-50"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
          color: isDark ? "#c8c9cc" : "#4b5563",
        }}
        aria-label="Export as PDF"
      >
        <Printer className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setIsDark((d) => !d)}
        className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
          color: isDark ? "#c8c9cc" : "#4b5563",
        }}
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
