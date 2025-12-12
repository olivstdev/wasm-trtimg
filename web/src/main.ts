import init, {
  grayscale_inplace,
  invert_inplace,
} from "./wasm_pkg/wasm_filters";

const fileInput = document.querySelector<HTMLInputElement>("#file")!;
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const btnJs = document.querySelector<HTMLButtonElement>("#btn-js")!;
const btnWasm = document.querySelector<HTMLButtonElement>("#btn-wasm")!;
const invert = document.querySelector<HTMLInputElement>("#invert")!;
const invertVal = document.querySelector<HTMLSpanElement>("#invertVal")!;
const log = document.querySelector<HTMLSpanElement>("#log")!;

const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

let originalImageData: ImageData | null = null;

// --- Filtre JS (référence)
function grayscaleJsInplace(pixels: Uint8ClampedArray) {
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const y = (77 * r + 150 * g + 29 * b) >> 8;
    pixels[i] = y;
    pixels[i + 1] = y;
    pixels[i + 2] = y;
  }
}

function timeIt(label: string, fn: () => void) {
  const t0 = performance.now();
  fn();
  const t1 = performance.now();
  log.textContent = `${label}: ${(t1 - t0).toFixed(2)} ms`;
}

async function main() {
  // Init WASM
  await init();

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    log.textContent = `Image chargée: ${canvas.width}x${canvas.height}`;
  });

  btnJs.addEventListener("click", () => {
    if (!originalImageData) return;

    // Copier l’original pour pouvoir rejouer le test
    const data = new ImageData(
      new Uint8ClampedArray(originalImageData.data),
      originalImageData.width,
      originalImageData.height
    );

    timeIt("JS grayscale", () => grayscaleJsInplace(data.data));
    ctx.putImageData(data, 0, 0);
  });

  btnWasm.addEventListener("click", () => {
    if (!originalImageData) return;

    // ⚠️ WASM attend un &mut [u8] : on utilise Uint8Array
    // On copie l’original (comme pour JS) :
    const copy = new Uint8Array(originalImageData.data); // Uint8Array view
    const data = new ImageData(
      new Uint8ClampedArray(copy.buffer),
      originalImageData.width,
      originalImageData.height
    );

    timeIt("WASM grayscale", () => grayscale_inplace(copy));
    ctx.putImageData(data, 0, 0);
  });

  invert.addEventListener("input", () => {
    invertVal.textContent = Number(invert.value).toFixed(2);
    if (!originalImageData) return;

    // On part de l’original, puis on applique l’inversion WASM selon le slider
    const copy = new Uint8Array(originalImageData.data);
    const data = new ImageData(
      new Uint8ClampedArray(copy.buffer),
      originalImageData.width,
      originalImageData.height
    );

    const amount = Number(invert.value);
    timeIt("WASM invert", () => invert_inplace(copy, amount));
    ctx.putImageData(data, 0, 0);
  });
}

main();
