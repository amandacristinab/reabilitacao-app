import { describe, expect, test } from "vitest";
import { evaluateArmInFramePose } from "./armInFrameRules";

function lm(x, y, visibility = 1) {
  return { x, y, visibility };
}

function makeLandmarks({ side = "right", visibility = 1 }) {
  const landmarks = Array.from({ length: 33 }, () => lm(0.5, 0.5, 0));
  if (side === "right") {
    landmarks[12] = lm(0.55, 0.45, visibility);
    landmarks[14] = lm(0.6, 0.6, visibility);
    landmarks[16] = lm(0.52, 0.7, visibility);
  } else {
    landmarks[11] = lm(0.45, 0.45, visibility);
    landmarks[13] = lm(0.4, 0.6, visibility);
    landmarks[15] = lm(0.48, 0.7, visibility);
  }
  return landmarks;
}

describe("evaluateArmInFramePose", () => {
  test("returns not ok when landmarks are missing", () => {
    const res = evaluateArmInFramePose({ landmarks: null });
    expect(res.ok).toBe(false);
  });

  test("returns not ok when visibility is low", () => {
    const res = evaluateArmInFramePose({
      landmarks: makeLandmarks({ side: "right", visibility: 0.1 }),
    });
    expect(res.ok).toBe(false);
  });

  test("returns ok when right arm is visible", () => {
    const res = evaluateArmInFramePose({
      landmarks: makeLandmarks({ side: "right", visibility: 0.9 }),
    });
    expect(res.ok).toBe(true);
  });

  test("returns ok when left arm is visible", () => {
    const res = evaluateArmInFramePose({
      landmarks: makeLandmarks({ side: "left", visibility: 0.9 }),
    });
    expect(res.ok).toBe(true);
  });
});

