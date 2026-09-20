// Each tuple is x, y, z, rotation x/y/z, uniform scale.
// Window identities keep their relative routes: upper left, upper right,
// lower left / middle right, lower right. No route swaps two identities.
export const layouts = {
  float: [
    [-2.55, 1.55, .12, -.06, -.09, -.045, .9],
    [2.55, 1.55, .12, .05, .08, .045, .9],
    [-2.55, -1.55, .12, .05, .07, .04, .9],
    [2.55, -1.55, .12, -.05, -.08, -.035, .9]
  ],
  focus: [
    [-2.3, 0, .12, 0, 0, 0, 1.12],
    [2.65, 1.82, .12, 0, 0, 0, .57],
    [2.65, 0, .12, 0, 0, 0, .57],
    [2.65, -1.82, .12, 0, 0, 0, .57]
  ],
  grid: [
    [-2.4, 1.5, .12, 0, 0, 0, 1],
    [2.4, 1.5, .12, 0, 0, 0, 1],
    [-2.4, -1.5, .12, 0, 0, 0, 1],
    [2.4, -1.5, .12, 0, 0, 0, 1]
  ]
};

export const duration = 1.45;
const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a.map((n, i) => n + (b[i] - n) * t);
const compact = pose => [pose[0], pose[1], .12, 0, 0, 0, .46];

function relocate(from, end, progress, index) {
  if (index !== 2 || Math.sign(from[0]) === Math.sign(end[0])) return mix(compact(from), compact(end), smooth(progress));
  // The lower-left window uses the empty central corridor when joining or
  // leaving the focus column. A diagonal would cut across the lower-right one.
  const waypoints = [compact(from), [0,from[1],.12,0,0,0,.46], [0,end[1],.12,0,0,0,.46], compact(end)];
  const step = Math.min(2, Math.floor(progress * 3));
  return mix(waypoints[step], waypoints[step + 1], smooth(progress * 3 - step));
}

export function poseAt(mode, seconds = 0, float = false) {
  return layouts[mode].map((pose, i) => {
    const value = [...pose];
    if (mode === 'float' && float) value[1] += Math.sin(seconds * .6 + i * 1.6) * .035;
    return value;
  });
}

export function transitionPose(from, target, progress) {
  const end = layouts[target];
  // Float and grid share four separate quadrants, so they can glide directly.
  if (from[2][0] < 0 && end[2][0] < 0) return from.map((p, i) => mix(p, end[i], smooth(progress)));
  // Reserve space before relocating a window, then expand only after arrival.
  // Independent easing in each phase makes all phase boundaries stationary.
  if (progress < .24) return from.map(p => mix(p, compact(p), smooth(progress / .24)));
  if (progress < .72) return from.map((p, i) => relocate(p, end[i], (progress - .24) / .48, i));
  return from.map((_, i) => mix(compact(end[i]), end[i], smooth((progress - .72) / .28)));
}

export function createMotion(initial = 'float') {
  let current = initial, requested = initial, active = null;
  let pose = poseAt(initial);
  return {
    get requested() { return requested; },
    get current() { return current; },
    get phase() { return active ? active.progress < .24 ? 'gather' : active.progress < .72 ? 'move' : 'expand' : 'settled'; },
    get settled() { return !active && current === requested; },
    get poses() { return pose.map(p => [...p]); },
    request(value, instant = false) {
      if (!Object.hasOwn(layouts, value)) return;
      requested = value;
      if (instant) { current = requested; active = null; pose = poseAt(current); return; }
      // Coalesce rapid input to the latest choice. Never splice a new route
      // into the middle of a relocation, where the safety bounds differ.
      if (!active && requested !== current) active = { from: pose.map(p => [...p]), target: requested, progress: 0 };
    },
    step(dt, seconds, moving = true) {
      if (active) {
        if (moving) active.progress = Math.min(1, active.progress + dt / duration);
        pose = transitionPose(active.from, active.target, active.progress);
        if (active.progress === 1) {
          current = active.target; active = null;
          if (requested !== current) this.request(requested);
        }
      } else if (moving) pose = poseAt(current, seconds, true);
      return this.poses;
    }
  };
}
