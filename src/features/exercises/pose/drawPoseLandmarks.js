const BODY_CONNECTIONS = [
  [11, 12],
  [11, 13], [13, 15],
  [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24],
  [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
  [24, 26], [26, 28], [28, 30], [30, 32], [28, 32],
];

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

const EXCLUDED_POSE_INDICES = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 17, 18, 19, 20, 21, 22]);
const VISIBILITY_THRESHOLD = 0.3;

function toCanvas(lm, videoW, videoH, canvasW, canvasH) {
  const scale = Math.max(canvasW / videoW, canvasH / videoH);
  const offsetX = (videoW * scale - canvasW) / 2;
  const offsetY = (videoH * scale - canvasH) / 2;
  return {
    x: lm.x * videoW * scale - offsetX,
    y: lm.y * videoH * scale - offsetY,
  };
}

export function drawPoseLandmarks(canvas, poseLandmarks, handLandmarksList, video) {
  if (!canvas) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const ctx = canvas.getContext("2d");
  const { width: canvasW, height: canvasH } = canvas;

  ctx.clearRect(0, 0, canvasW, canvasH);

  const videoW = video?.videoWidth || canvasW;
  const videoH = video?.videoHeight || canvasH;

  // Body skeleton
  if (poseLandmarks && poseLandmarks.length > 0) {
    ctx.strokeStyle = "rgba(0, 220, 90, 0.85)";
    ctx.lineWidth = 2.5;
    for (const [start, end] of BODY_CONNECTIONS) {
      const s = poseLandmarks[start];
      const e = poseLandmarks[end];
      if (!s || !e) continue;
      if ((s.visibility ?? 1) < VISIBILITY_THRESHOLD || (e.visibility ?? 1) < VISIBILITY_THRESHOLD) continue;
      const sp = toCanvas(s, videoW, videoH, canvasW, canvasH);
      const ep = toCanvas(e, videoW, videoH, canvasW, canvasH);
      ctx.beginPath();
      ctx.moveTo(sp.x, sp.y);
      ctx.lineTo(ep.x, ep.y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(230, 0, 130, 0.9)";
    for (let i = 0; i < poseLandmarks.length; i++) {
      if (EXCLUDED_POSE_INDICES.has(i)) continue;
      const lm = poseLandmarks[i];
      if ((lm.visibility ?? 1) < VISIBILITY_THRESHOLD) continue;
      const p = toCanvas(lm, videoW, videoH, canvasW, canvasH);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // Hand skeleton (full finger detail)
  if (handLandmarksList && handLandmarksList.length > 0) {
    for (const handLandmarks of handLandmarksList) {
      ctx.strokeStyle = "rgba(0, 180, 255, 0.9)";
      ctx.lineWidth = 2;
      for (const [start, end] of HAND_CONNECTIONS) {
        const s = handLandmarks[start];
        const e = handLandmarks[end];
        if (!s || !e) continue;
        const sp = toCanvas(s, videoW, videoH, canvasW, canvasH);
        const ep = toCanvas(e, videoW, videoH, canvasW, canvasH);
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);
        ctx.lineTo(ep.x, ep.y);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(255, 220, 0, 0.95)";
      for (const lm of handLandmarks) {
        const p = toCanvas(lm, videoW, videoH, canvasW, canvasH);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}

export function clearPoseCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
