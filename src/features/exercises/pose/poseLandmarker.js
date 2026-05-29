let cachedPromise = null;

const DEFAULT_WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

const DEFAULT_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

export async function getPoseLandmarker({
  wasmBaseUrl = DEFAULT_WASM_BASE,
  modelUrl = DEFAULT_MODEL_URL,
} = {}) {
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    const { FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision");

    const vision = await FilesetResolver.forVisionTasks(wasmBaseUrl);
    return PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: modelUrl,
      },
      runningMode: "VIDEO",
      numPoses: 1,
    });
  })();

  return cachedPromise;
}

export function resetPoseLandmarkerCacheForTests() {
  cachedPromise = null;
}

