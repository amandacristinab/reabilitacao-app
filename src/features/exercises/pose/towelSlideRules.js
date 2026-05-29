const RIGHT_SHOULDER = 12;
const RIGHT_ELBOW = 14;
const RIGHT_WRIST = 16;
const LEFT_SHOULDER = 11;
const LEFT_ELBOW = 13;
const LEFT_WRIST = 15;

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function pickArm(landmarks) {
  const r = landmarks?.[RIGHT_WRIST];
  const l = landmarks?.[LEFT_WRIST];
  const rv = isFiniteNumber(r?.visibility) ? r.visibility : 0;
  const lv = isFiniteNumber(l?.visibility) ? l.visibility : 0;
  return rv >= lv ? "right" : "left";
}

function getIndices(side) {
  if (side === "left") return { shoulder: LEFT_SHOULDER, elbow: LEFT_ELBOW, wrist: LEFT_WRIST };
  return { shoulder: RIGHT_SHOULDER, elbow: RIGHT_ELBOW, wrist: RIGHT_WRIST };
}

export function evaluateTowelSlidePose({
  landmarks,
  prev,
  timestampMs,
  config,
}) {
  const cfg = {
    minVisibility: 0.55,
    minSpeed: 0.02,
    maxSpeed: 0.35,
    minAmplitude: 0.06,
    maxElbowDrift: 0.08,
    reversalWindowMs: 1800,
    minReversals: 1,
    minDxForReversal: 0.008,
    ...config,
  };

  if (!Array.isArray(landmarks) || landmarks.length < 17) {
    return { ok: false, reason: "Pose não detectada", next: prev ?? null };
  }

  const side = pickArm(landmarks);
  const idx = getIndices(side);

  const shoulder = landmarks[idx.shoulder];
  const elbow = landmarks[idx.elbow];
  const wrist = landmarks[idx.wrist];

  const visibility = Math.min(
    isFiniteNumber(shoulder?.visibility) ? shoulder.visibility : 0,
    isFiniteNumber(elbow?.visibility) ? elbow.visibility : 0,
    isFiniteNumber(wrist?.visibility) ? wrist.visibility : 0,
  );

  if (visibility < cfg.minVisibility) {
    return { ok: false, reason: "Mão fora do enquadramento", next: prev ?? null };
  }

  const now = isFiniteNumber(timestampMs) ? timestampMs : Date.now();
  const prevState = prev ?? null;
  const hasPrev = prevState && isFiniteNumber(prevState.ts) && isFiniteNumber(prevState.wristX);

  const state = {
    ts: now,
    wristX: wrist.x,
    elbowY: elbow.y,
    minX: hasPrev ? Math.min(prevState.minX, wrist.x) : wrist.x,
    maxX: hasPrev ? Math.max(prevState.maxX, wrist.x) : wrist.x,
    baseElbowY: hasPrev ? prevState.baseElbowY : elbow.y,
    lastDxSign: hasPrev && isFiniteNumber(prevState.lastDxSign) ? prevState.lastDxSign : 0,
    reversalTs: Array.isArray(prevState?.reversalTs) ? prevState.reversalTs.slice(0, 10) : [],
  };

  if (!hasPrev) {
    return { ok: false, reason: "Iniciando...", next: state };
  }

  const dt = Math.max(1, now - prevState.ts);
  const dx = wrist.x - prevState.wristX;
  const speed = Math.abs(dx) / (dt / 1000);
  const amplitude = state.maxX - state.minX;
  const elbowDrift = Math.abs(elbow.y - prevState.baseElbowY);

  const dxSign = dx === 0 ? 0 : Math.sign(dx);
  const canTrackReversal = Math.abs(dx) >= cfg.minDxForReversal && dxSign !== 0;
  if (canTrackReversal) {
    const last = state.lastDxSign;
    if (last !== 0 && dxSign !== last) {
      state.reversalTs = [now, ...state.reversalTs].slice(0, 10);
    }
    state.lastDxSign = dxSign;
  }

  const reversalCount = state.reversalTs.filter((t) => now - t <= cfg.reversalWindowMs).length;

  if (elbowDrift > cfg.maxElbowDrift) {
    return { ok: false, reason: "Mantenha o braço apoiado", next: state };
  }

  if (amplitude < cfg.minAmplitude) {
    return { ok: false, reason: "Movimente a mão", next: state };
  }

  if (speed < cfg.minSpeed) {
    return { ok: false, reason: "Mais ritmo", next: state };
  }

  if (speed > cfg.maxSpeed) {
    return { ok: false, reason: "Devagar", next: state };
  }

  if (reversalCount < cfg.minReversals) {
    return { ok: false, reason: "Faça ida e volta", next: state };
  }

  return { ok: true, reason: "Correto", next: state };
}
