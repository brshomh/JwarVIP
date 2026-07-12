
import { FilesetResolver, FaceDetector } from '@mediapipe/tasks-vision';

let faceDetector: FaceDetector | null = null;
let isInitializing = false;

export const initializeFaceDetector = async () => {
  if (faceDetector || isInitializing) return;
  isInitializing = true;

  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    
    faceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
        delegate: "GPU"
      },
      runningMode: "VIDEO"
    });
    // Initialized silently
  } catch (error) {
    // Silent fail safely
  } finally {
    isInitializing = false;
  }
};

export const detectFace = (video: HTMLVideoElement, timestamp: number): boolean => {
  if (!faceDetector) return true; // Fail safe to true if not loaded yet to prevent premature bans during load

  try {
    const detections = faceDetector.detectForVideo(video, timestamp);
    return detections.detections.length > 0;
  } catch (e) {
    // In case of error (e.g. video closed), assume safe
    return true; 
  }
};

// New: Analyze frame brightness (0 to 255)
export const analyzeBrightness = (canvas: HTMLCanvasElement, video: HTMLVideoElement): number => {
    try {
        const ctx = canvas.getContext('2d');
        if (!ctx) return 128;

        // Draw a small version of the frame for performance
        ctx.drawImage(video, 0, 0, 50, 50);
        const imageData = ctx.getImageData(0, 0, 50, 50);
        const data = imageData.data;
        let r, g, b, avg;
        let colorSum = 0;

        for (let x = 0, len = data.length; x < len; x += 4) {
            r = data[x];
            g = data[x + 1];
            b = data[x + 2];
            avg = Math.floor((r + g + b) / 3);
            colorSum += avg;
        }

        const brightness = Math.floor(colorSum / (50 * 50));
        return brightness;
    } catch (e) {
        return 128;
    }
};
