const RIGHT_SHOULDER = 12;
const RIGHT_ELBOW = 14;
const RIGHT_WRIST = 16;
const LEFT_SHOULDER = 11;
const LEFT_ELBOW = 13;
const LEFT_WRIST = 15;

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function getPointVisibility(point) {
  return isFiniteNumber(point?.visibility) ? point.visibility : 0;
}

function sideVisibility(landmarks, { shoulder, elbow, wrist }) {
  const shoulderV = getPointVisibility(landmarks?.[shoulder]);
  const elbowV = getPointVisibility(landmarks?.[elbow]);
  const wristV = getPointVisibility(landmarks?.[wrist]);
  return Math.min(shoulderV, elbowV, wristV);
}

export function evaluateArmInFramePose({ landmarks, config } = {}) {
  const cfg = {
    minVisibility: 0.55,
    ...config,
  };

  if (!Array.isArray(landmarks) || landmarks.length < 17) {
    return { ok: false, reason: "Pose não detectada" };
  }

  const right = sideVisibility(landmarks, { shoulder: RIGHT_SHOULDER, elbow: RIGHT_ELBOW, wrist: RIGHT_WRIST });
  const left = sideVisibility(landmarks, { shoulder: LEFT_SHOULDER, elbow: LEFT_ELBOW, wrist: LEFT_WRIST });

  const visible = Math.max(right, left);
  if (visible < cfg.minVisibility) {
    return { ok: false, reason: "Mostre o braço e a mão" };
  }

  return { ok: true, reason: "POSIÇÃO CORRETA" };
}

