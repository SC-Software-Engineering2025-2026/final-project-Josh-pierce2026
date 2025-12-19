import React, { useEffect, useState, useRef } from "react";

export default function ManualTimer() {
  const [input, setInput] = useState("00:01:00");
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  function parseInput(str) {
    // accept HH:MM:SS or MM:SS or minutes number
    if (str.includes(":")) {
      const parts = str.split(":").map(Number).reverse();
      let sec = 0;
      if (parts[0]) sec += parts[0];
      if (parts[1]) sec += parts[1] * 60;
      if (parts[2]) sec += parts[2] * 3600;
      return sec;
    }
    const n = Number(str);
    if (Number.isFinite(n)) return Math.floor(n * 60);
    return 0;
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function start() {
    const sec = parseInput(input);
    setRemaining(sec);
    setRunning(true);
  }

  function formatSeconds(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0)
      return `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div>
      <div className="panel">
        <div className="muted">Manual Timer</div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 6,
              background: "#071029",
              color: "#e6eef7",
              border: "1px solid #123",
            }}
          />
          <button className="mode-btn" onClick={start}>
            Start
          </button>
        </div>
        <div className="timer">{formatSeconds(remaining)}</div>
        {remaining === 0 && !running && (
          <div className="muted">Time is up!</div>
        )}
      </div>
    </div>
  );
}
