import React, { useState, useEffect } from "react";
import ScheduleTimer from "./components/ScheduleTimer";
import ManualTimer from "./components/ManualTimer";
import ClockView from "./components/ClockView";
import { buildDaySchedule } from "./utils/schedule";

export default function App() {
  const [modeView, setModeView] = useState("schedule"); // schedule | manual
  const [selectedDay, setSelectedDay] = useState(1);
  const [scheduleMode, setScheduleMode] = useState("standard"); // standard | monday | wednesday
  const [syncToClock, setSyncToClock] = useState(true);
  const [now, setNow] = useState(new Date());
  const [inSession, setInSession] = useState(true);

  function handlePeriodEnd(period) {
    // simple alert or console - show Time is up!
    console.log("Period ended", period);
    // for UI we'll just show an alert box
    alert("Time is up!");
  }

  // keep a live clock to re-evaluate whether it's school hours
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // compute whether current time falls into the day's schedule window
  useEffect(() => {
    const periods = buildDaySchedule(selectedDay, scheduleMode);
    if (!periods || periods.length === 0) {
      setInSession(false);
      setSyncToClock(false);
      return;
    }
    const firstStart = periods[0].start;
    const lastEnd = periods[periods.length - 1].end;
    const nowIn = now >= firstStart && now < lastEnd;
    setInSession(nowIn);
    // don't allow enabling sync outside of school hours; if outside, force it off
    if (!nowIn && syncToClock) setSyncToClock(false);
  }, [now, selectedDay, scheduleMode]);

  return (
    <div className="app">
      <div className="sidebar">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Sierra Schedule</h3>
        </div>

        <div style={{ marginTop: 8 }}>
          <div className="muted">Mode</div>
          <div
            style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}
          >
            <button
              className={
                "mode-btn" + (modeView === "schedule" ? " active" : "")
              }
              onClick={() => setModeView("schedule")}
            >
              Schedule
            </button>
            <button
              className={"mode-btn" + (modeView === "manual" ? " active" : "")}
              onClick={() => setModeView("manual")}
            >
              Manual
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Schedule Sync</div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={syncToClock}
                disabled={!inSession}
                onChange={(e) => inSession && setSyncToClock(e.target.checked)}
              />
              <span className="muted">Sync to device time</span>
            </label>
            {!inSession && (
              <div className="muted" style={{ fontSize: 12 }}>
                Sync disabled: outside school hours
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Monday / Wednesday</div>
          <div
            style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}
          >
            <button
              className={
                "mode-btn" + (scheduleMode === "standard" ? " active" : "")
              }
              onClick={() => setScheduleMode("standard")}
            >
              Standard
            </button>
            <button
              className={
                "mode-btn" + (scheduleMode === "monday" ? " active" : "")
              }
              onClick={() => setScheduleMode("monday")}
            >
              Monday
            </button>
            <button
              className={
                "mode-btn" + (scheduleMode === "wednesday" ? " active" : "")
              }
              onClick={() => setScheduleMode("wednesday")}
            >
              Wednesday
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Days</div>
          <div style={{ marginTop: 8 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelectedDay(d);
                  setModeView("schedule");
                }}
                className={"day-btn" + (selectedDay === d ? " active" : "")}
              >
                Day {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="main">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>
            Day {selectedDay} • {scheduleMode}
          </h2>
          <div className="muted">
            Choose a day or a block to jump; manual timer accepts MM:SS or
            HH:MM:SS
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          {modeView === "schedule" && (
            <ScheduleTimer
              day={selectedDay}
              mode={scheduleMode}
              syncToClock={syncToClock}
              onPeriodEnd={handlePeriodEnd}
            />
          )}
          {modeView === "manual" && <ManualTimer />}
        </div>

        <div style={{ marginTop: 18 }}>
          {/* persistent clock at bottom */}
          <ClockView />
        </div>
      </div>
    </div>
  );
}
