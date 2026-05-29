import { describe, expect, test } from "vitest";
import { evaluateTowelSlidePose } from "./towelSlideRules";

function lm(x, y, visibility = 1) {
  return { x, y, visibility };
}

function makeLandmarks({ wristX, elbowY = 0.6, shoulderY = 0.45, visibility = 1, side = "right" }) {
  const landmarks = Array.from({ length: 33 }, () => lm(0.5, 0.5, 0));
  if (side === "right") {
    landmarks[12] = lm(0.55, shoulderY, visibility);
    landmarks[14] = lm(0.6, elbowY, visibility);
    landmarks[16] = lm(wristX, 0.7, visibility);
  } else {
    landmarks[11] = lm(0.45, shoulderY, visibility);
    landmarks[13] = lm(0.4, elbowY, visibility);
    landmarks[15] = lm(wristX, 0.7, visibility);
  }
  return landmarks;
}

describe("evaluateTowelSlidePose", () => {
  test("returns not ok when visibility is low", () => {
    const res = evaluateTowelSlidePose({
      landmarks: makeLandmarks({ wristX: 0.5, visibility: 0.1 }),
      prev: null,
      timestampMs: 0,
    });
    expect(res.ok).toBe(false);
  });

  test("requires direction reversal (back and forth) to be ok", () => {
    const t0 = 1000;

    const first = evaluateTowelSlidePose({
      landmarks: makeLandmarks({ wristX: 0.4 }),
      prev: null,
      timestampMs: t0,
    });

    const second = evaluateTowelSlidePose({
      landmarks: makeLandmarks({ wristX: 0.52 }),
      prev: first.next,
      timestampMs: t0 + 300,
      config: { minAmplitude: 0.05, minSpeed: 0.01, maxSpeed: 1, minDxForReversal: 0.001 },
    });

    expect(second.ok).toBe(false);

    const third = evaluateTowelSlidePose({
      landmarks: makeLandmarks({ wristX: 0.44 }),
      prev: second.next,
      timestampMs: t0 + 600,
      config: { minAmplitude: 0.05, minSpeed: 0.01, maxSpeed: 1, minDxForReversal: 0.001 },
    });

    expect(third.ok).toBe(true);
  });

  test("becomes ok after enough amplitude and speed", () => {
    const t0 = 1000;
    const first = evaluateTowelSlidePose({
      landmarks: makeLandmarks({ wristX: 0.4 }),
      prev: null,
      timestampMs: t0,
    });
    const second = evaluateTowelSlidePose({
      landmarks: makeLandmarks({ wristX: 0.52 }),
      prev: first.next,
      timestampMs: t0 + 300,
      config: { minAmplitude: 0.05, minSpeed: 0.01, maxSpeed: 1 },
    });
    expect(second.ok).toBe(false);
  });
});
