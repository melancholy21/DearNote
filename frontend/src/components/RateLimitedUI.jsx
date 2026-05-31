import { ShieldAlertIcon, RefreshCwIcon } from "lucide-react";
import { useState, useEffect } from "react";

const RateLimitedUI = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="glass-card rounded-2xl p-6 border-warning/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
            <ShieldAlertIcon className="size-6 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Slow down there!</h3>
            <p className="text-base-content/50 text-sm mb-4">
              You've made too many requests. Take a breather and try again in a moment.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-warning font-mono">{seconds}</span>
                <span className="text-xs text-base-content/30">seconds</span>
              </div>
              {seconds === 0 && (
                <button
                  className="btn btn-warning btn-sm gap-2 rounded-xl"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCwIcon className="size-3.5" />
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;