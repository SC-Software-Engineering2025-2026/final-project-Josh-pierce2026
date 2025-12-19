import React, { useState, useEffect } from "react";
import ScheduleTimer from "./components/ScheduleTimer";
import ManualTimer from "./components/ManualTimer";
import ClockView from "./components/ClockView";
import { buildDaySchedule } from "./utils/schedule";
import ClassEditor from "./components/ClassEditor";

export default function App() {
  const [modeView, setModeView] = useState("schedule"); // schedule | manual
  const [selectedDay, setSelectedDay] = useState(1);
  const [scheduleMode, setScheduleMode] = useState("standard"); // standard | monday | wednesday
  const [syncToClock, setSyncToClock] = useState(true);
  const [now, setNow] = useState(new Date());
  const [inSession, setInSession] = useState(true);
  const [classMap, setClassMap] = useState({});
  const [showClassEditor, setShowClassEditor] = useState(false);
  const [notification, setNotification] = useState({
    title: "",
    subtitle: "",
    visible: false,
  });

  function handlePeriodEnd(period) {
    // simple alert or console - show Time is up!
    console.log("Period ended", period);
    // show a large in-app notification instead of a blocking alert
    const title = "Time is up!";
    const subtitle = period && period.name ? period.name : "";
    setNotification({ title, subtitle, visible: true });
    // auto-hide after 6 seconds
    setTimeout(() => setNotification((n) => ({ ...n, visible: false })), 6000);
  }

  // keep a live clock to re-evaluate whether it's school hours
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // load class map from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sierra_classes");
      if (raw) setClassMap(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
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

  // when synced to device time, auto-select monday/wednesday/standard based on weekday
  useEffect(() => {
    if (!syncToClock) return;
    const today = new Date(now);
    const dow = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    if (dow === 1) setScheduleMode("monday");
    else if (dow === 3) setScheduleMode("wednesday");
    else setScheduleMode("standard");
  }, [syncToClock, now]);

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="muted">Classes</div>
            <button
              className="mode-btn"
              onClick={() => setShowClassEditor((s) => !s)}
            >
              {showClassEditor ? "Done" : "Edit classes"}
            </button>
          </div>
          {showClassEditor && (
            <ClassEditor
              initialMap={classMap}
              onSave={(m) => {
                setClassMap(m);
                setShowClassEditor(false);
              }}
              onCancel={() => setShowClassEditor(false)}
            />
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Days</div>
          <div style={{ marginTop: 8 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
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
              classMap={classMap}
            />
          )}
          {modeView === "manual" && (
            <ManualTimer onFinish={(p) => handlePeriodEnd(p)} />
          )}
        </div>

        <div style={{ marginTop: 18 }}>
          {/* persistent clock at bottom */}
          <ClockView />
        </div>
      </div>

      {/* large overlay notification when timers end */}
      {notification.visible && (
        <div
          className="overlay"
          onClick={() => setNotification((n) => ({ ...n, visible: false }))}
        >
          <div className="overlay-content" role="dialog" aria-live="assertive">
            <div className="overlay-title">{notification.title}</div>
            {notification.subtitle && (
              <div className="overlay-subtitle">{notification.subtitle}</div>
            )}
            <button
              className="overlay-close"
              onClick={(e) => {
                e.stopPropagation();
                setNotification((n) => ({ ...n, visible: false }));
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
