import React, { useEffect, useState, useRef } from "react";
import { buildDaySchedule, formatTime } from "../utils/schedule";

export default function ScheduleTimer({
  day = 1,
  mode = "standard",
  onPeriodEnd,
  syncToClock = true,
}) {
  const [periods, setPeriods] = useState([]);
  const [now, setNow] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [inSession, setInSession] = useState(true);

  const countdownRef = useRef(null);
  const nowRef = useRef(null);
  const prevDayRef = useRef(day);
  const lastNotifiedRef = useRef(null);

  // build schedule when day or mode changes
  useEffect(() => {
    const p = buildDaySchedule(day, mode);
    setPeriods(p);
    setActiveIndex(0);
    lastNotifiedRef.current = null;
  }, [day, mode]);

  // live clock tick
  useEffect(() => {
    nowRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(nowRef.current);
  }, []);

  // auto-start first period when day changes ONLY if not synced to clock
  useEffect(() => {
    if (prevDayRef.current !== day) {
      if (!syncToClock && periods.length) {
        startCountdownForIndex(0);
      }
    }
    prevDayRef.current = day;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, periods, syncToClock]);

  function startCountdownForIndex(index) {
    if (!periods[index]) return;
    clearCountdown();
    const dur = Math.max(
      0,
      Math.ceil((periods[index].end - periods[index].start) / 1000)
    );
    setActiveIndex(index);
    setCountdown(dur);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearCountdown();
          const finished = periods[index];
          onPeriodEnd && onPeriodEnd(finished);
          const next = index + 1;
          if (periods[next]) {
            setTimeout(() => startCountdownForIndex(next), 400);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function clearCountdown() {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
  }

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clearCountdown();
      if (nowRef.current) clearInterval(nowRef.current);
    };
  }, []);

  // when synced to clock, derive active period from device time and detect in-session
  useEffect(() => {
    if (!syncToClock) return;
    if (countdown > 0) return;
    if (!periods.length) return;

    const firstStart = periods[0].start;
    const lastEnd = periods[periods.length - 1].end;
    const nowInSession = now >= firstStart && now < lastEnd;
    setInSession(nowInSession);

    if (!nowInSession) {
      setActiveIndex(-1);
      return;
    }

    const idx = periods.findIndex((per) => now >= per.start && now < per.end);
    if (idx !== -1) {
      setActiveIndex(idx);
    } else {
      const up = periods.findIndex((per) => per.start > now);
      setActiveIndex(up === -1 ? periods.length - 1 : up);
    }
  }, [now, periods, countdown, syncToClock]);

  // when synced to clock, notify once when a period ends
  useEffect(() => {
    if (!syncToClock) return;
    if (!periods.length) return;
    if (activeIndex === -1) return;
    const active = periods[activeIndex];
    if (!active) return;
    if (now >= active.end) {
      if (lastNotifiedRef.current !== activeIndex) {
        onPeriodEnd && onPeriodEnd(active);
        lastNotifiedRef.current = activeIndex;
      }
    }
  }, [now, syncToClock, periods, activeIndex, onPeriodEnd]);

  function jumpTo(index) {
    if (!periods[index]) return;
    if (syncToClock) {
      // in sync mode, just select the period (don't start manual countdown)
      setActiveIndex(index);
    } else {
      startCountdownForIndex(index);
    }
  }

  function formatSeconds(sec) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const active = periods[activeIndex];
  let remaining = 0;
  if (countdown > 0) {
    remaining = countdown;
  } else if (active) {
    remaining = Math.max(0, Math.ceil((active.end - now) / 1000));
  }

  return (
    <div>
      <div className="panel">
        <div className="muted">
          Schedule for Day {day} ({mode})
        </div>

        {syncToClock && !inSession ? (
          <div style={{ padding: 12 }}>
            <div className="muted">School is not in session</div>
            <div className="muted">
              School hours:{" "}
              {periods.length ? formatTime(periods[0].start) : "8:30"} -{" "}
              {periods.length
                ? formatTime(periods[periods.length - 1].end)
                : "2:55"}
            </div>
            <div style={{ marginTop: 8 }} className="muted">
              Current time: {new Date().toLocaleTimeString()}
            </div>
          </div>
        ) : active ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {active.name} <span className="muted">({active.type})</span>
                </div>
                <div className="muted">
                  {formatTime(active.start)} - {formatTime(active.end)}
                </div>
              </div>
              <div className="timer">{formatSeconds(remaining)}</div>
            </div>
          </>
        ) : (
          <div className="muted">No active period right now</div>
        )}
      </div>

      <div className="list">
        {periods.map((p, idx) => (
          <div
            key={idx}
            className={"block" + (idx === activeIndex ? " active" : "")}
            onClick={() => jumpTo(idx)}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                {p.name} <span className="muted">({p.type})</span>
              </div>
              <div className="muted">
                {formatTime(p.start)} - {formatTime(p.end)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
