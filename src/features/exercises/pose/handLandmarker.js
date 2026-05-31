let cachedPromise = null;

const DEFAULT_WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

const DEFAULT_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export async function getHandLandmarker({
  wasmBaseUrl = DEFAULT_WASM_BASE,
  modelUrl = DEFAULT_MODEL_URL,
} = {}) {
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");

    const vision = await FilesetResolver.forVisionTasks(wasmBaseUrl);
    return HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: modelUrl,
      },
      runningMode: "VIDEO",
      numHands: 2,
    });
  })();

  return cachedPromise;
}
