// schedule utilities: build periods with start/end times for a given day and mode

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

// block rotations per day (A-H)
const rotations = {
  1: ["A", "B", "C", "D", "E", "F"],
  2: ["G", "H", "A", "B", "C", "D"],
  3: ["E", "F", "G", "H", "A", "B"],
  4: ["C", "D", "E", "F", "G", "H"],
  5: ["B", "A", "D", "C", "F", "E"],
  6: ["H", "G", "B", "A", "D", "C"],
  7: ["F", "E", "H", "G", "B", "A"],
  8: ["D", "C", "F", "E", "H", "G"],
};

// Build schedule: returns array of periods {type: 'block'|'passing'|'lab'|'lunch', name, start, end}
// mode: 'standard' | 'monday' | 'wednesday'
export function buildDaySchedule(dayNumber, mode = "standard") {
  const blocks = rotations[dayNumber] || rotations[1];
  // start at 8:30
  const start = new Date();
  start.setHours(8, 30, 0, 0);

  let cursor = new Date(start);
  const periods = [];

  // helper to push block
  function pushBlock(name, durationMin) {
    const s = new Date(cursor);
    const e = addMinutes(s, durationMin);
    periods.push({ type: "block", name, start: s, end: e });
    cursor = new Date(e);
  }

  // helper to push passing
  function pushPassing(min = 5) {
    const s = new Date(cursor);
    const e = addMinutes(s, min);
    periods.push({ type: "passing", name: "Passing", start: s, end: e });
    cursor = new Date(e);
  }

  // decide durations based on mode
  let blockDur = 50;
  let labDur = 25;
  let labName = "Lab";
  let passingMin = 5;

  if (mode === "monday") {
    // Morning Meeting is 30 minutes (5 minutes longer than standard lab).
    // Monday otherwise follows the standard structure. There is no extra
    // inserted delay period — subsequent periods will start immediately
    // after the meeting (passing rules remain standard). The final block
    // is shortened to 45 minutes (handled later) so the day still ends
    // at the same time.
    labDur = 30;
    labName = "Morning Meeting";
    passingMin = 5;
  }
  if (mode === "wednesday") {
    // blocks are 45, lab 45 and has passing on both ends
    blockDur = 45;
    labDur = 45;
    labName = "Morning Meeting";
    // keep standard passing
    passingMin = 5;
  }

  // Build day: 6 blocks with lab after 2nd, lunch after 4th.
  for (let i = 0; i < blocks.length; i++) {
    // push block i
    // for last block on monday, make it 45 (shorter by 5)
    let dur = blockDur;
    if (mode === "monday" && i === blocks.length - 1) {
      dur = 45;
    }
    pushBlock(blocks[i], dur);

    // after block 2 (index 1) push lab (no passing before/after unless wednesday)
    if (i === 1) {
      if (mode === "wednesday") {
        // wednesday: passing before and after lab
        pushPassing(passingMin);
        const s = new Date(cursor);
        const e = addMinutes(s, labDur);
        periods.push({ type: "lab", name: labName, start: s, end: e });
        cursor = new Date(e);
        pushPassing(passingMin);
      } else if (mode === "monday") {
        // monday: lab (Morning Meeting) with no passing before/after
        const s = new Date(cursor);
        const e = addMinutes(s, labDur);
        periods.push({ type: "lab", name: labName, start: s, end: e });
        cursor = new Date(e);
      } else {
        // standard: lab with no passing before/after
        const s = new Date(cursor);
        const e = addMinutes(s, labDur);
        periods.push({ type: "lab", name: labName, start: s, end: e });
        cursor = new Date(e);
      }
    } else if (i === 3) {
      // lunch after 4th block (no passing)
      const s = new Date(cursor);
      // Monday: lunch delayed 5 minutes effectively included in passing assumption above; we model lunch duration same but starting point handled by cursor
      const e = addMinutes(s, 45);
      periods.push({ type: "lunch", name: "Lunch", start: s, end: e });
      cursor = new Date(e);
    }

    // after each block except after lab and lunch endpoints, add passing
    if (i !== blocks.length - 1) {
      // but if lab or lunch was added immediately after, we don't add extra passing (spec states no passing before/after lab and lunch)
      if (i === 1 || i === 3) {
        // already handled
      } else {
        pushPassing(passingMin);
      }
    }
  }

  return periods;
}

// helper to format time hh:mm
export function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
