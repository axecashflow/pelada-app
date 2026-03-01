import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Plus, Timer } from "lucide-react";
import { cn } from "@/app/ui/lib/utils";

import { SportButton } from "@/app/ui/components/SportButton";

interface MatchTimerProps {
  defaultMinutes: number;
  onTimeUp?: () => void;
}

export function MatchTimer({ defaultMinutes, onTimeUp }: MatchTimerProps) {
  const [durationMinutes, setDurationMinutes] = useState(defaultMinutes);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [stoppageMinutes, setStoppageMinutes] = useState(0);
  const [showStoppageInput, setShowStoppageInput] = useState(false);
  const [timeUpFired, setTimeUpFired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = (durationMinutes + stoppageMinutes) * 60;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const isOvertime =
    elapsedSeconds > durationMinutes * 60 && stoppageMinutes > 0;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next >= totalSeconds) {
            setIsRunning(false);
            if (!timeUpFired) {
              setTimeUpFired(true);
              onTimeUp?.();
            }
            return totalSeconds;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, totalSeconds, timeUpFired, onTimeUp]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setStoppageMinutes(0);
    setTimeUpFired(false);
  };

  const handleToggle = () => {
    if (remainingSeconds === 0 && !isRunning) return;
    setIsRunning((prev) => !prev);
  };

  const adjustDuration = (delta: number) => {
    if (isRunning) return;
    setDurationMinutes((prev) => Math.max(1, prev + delta));
    setElapsedSeconds(0);
    setTimeUpFired(false);
  };

  const addStoppage = useCallback((mins: number) => {
    setStoppageMinutes((prev) => prev + mins);
    setShowStoppageInput(false);
    setTimeUpFired(false);
  }, []);

  const progress =
    totalSeconds > 0 ? Math.min(100, (elapsedSeconds / totalSeconds) * 100) : 0;

  const timeColor =
    remainingSeconds <= 60 && remainingSeconds > 0
      ? "text-destructive"
      : isOvertime
        ? "text-yellow-500"
        : "text-foreground";

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Cronômetro
          </span>
        </div>
      </div>

      {/* Duration adjuster (only when paused and not started) */}
      {!isRunning && elapsedSeconds === 0 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => adjustDuration(-5)}
            className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center text-sm font-bold transition-colors"
          >
            −
          </button>
          <input
            type="number"
            value={durationMinutes ? durationMinutes : ""}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                setDurationMinutes(val);
                setElapsedSeconds(0);
                setTimeUpFired(false);
              } else if (e.target.value === "") {
                setDurationMinutes(0);
              }
            }}
            min={1}
            className="w-16 text-center text-sm font-medium text-foreground bg-muted border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-sm text-muted-foreground">min</span>
          <button
            onClick={() => adjustDuration(5)}
            className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center text-sm font-bold transition-colors"
          >
            +
          </button>
        </div>
      )}

      {/* Timer display */}
      <div className="text-center">
        <motion.p
          key={remainingSeconds}
          className={cn("text-5xl font-mono font-bold tabular-nums", timeColor)}
        >
          {formatTime(remainingSeconds)}
        </motion.p>
        {stoppageMinutes > 0 && (
          <p className="text-xs text-yellow-500 mt-1">
            +{stoppageMinutes} min acréscimo
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors",
            isOvertime
              ? "bg-yellow-500"
              : remainingSeconds <= 60 && elapsedSeconds > 0
                ? "bg-destructive"
                : "bg-primary",
          )}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <SportButton
          onClick={handleToggle}
          size="sm"
          variant={isRunning ? "secondary" : "primary"}
          className="flex-1"
          disabled={remainingSeconds === 0 && !isRunning}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-1" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1" />
              {elapsedSeconds > 0 ? "Retomar" : "Iniciar"}
            </>
          )}
        </SportButton>

        <button
          onClick={handleReset}
          className="w-9 h-9 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
          title="Reiniciar"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {elapsedSeconds > 0 && (
          <button
            onClick={() => setShowStoppageInput((p) => !p)}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
              showStoppageInput
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            title="Acréscimo"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stoppage time selector */}
      <AnimatePresence>
        {showStoppageInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 pt-1"
          >
            <span className="text-xs text-muted-foreground">Acréscimo:</span>
            {[1, 2, 3, 5].map((m) => (
              <button
                key={m}
                onClick={() => addStoppage(m)}
                className="px-3 py-1.5 rounded-lg bg-muted text-xs font-semibold text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                +{m}min
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
