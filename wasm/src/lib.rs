use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn grayscale_inplace(pixels: &mut [u8]) {
    // pixels: RGBA RGBA RGBA...
    // On laisse alpha inchangé
    for i in (0..pixels.len()).step_by(4) {
        let r = pixels[i] as u16;
        let g = pixels[i + 1] as u16;
        let b = pixels[i + 2] as u16;

        // Luma approx (rapide, suffisant pour le TP)
        let y = (77 * r + 150 * g + 29 * b) >> 8; // ~0.299, 0.587, 0.114

        let y8 = y as u8;
        pixels[i] = y8;
        pixels[i + 1] = y8;
        pixels[i + 2] = y8;
    }
}

#[wasm_bindgen]
pub fn invert_inplace(pixels: &mut [u8], amount: f32) {
    // amount: 0..1
    let a = amount.clamp(0.0, 1.0);
    for i in (0..pixels.len()).step_by(4) {
        let r = pixels[i] as f32;
        let g = pixels[i + 1] as f32;
        let b = pixels[i + 2] as f32;

        pixels[i]     = (r + a * ((255.0 - r) - r)).round().clamp(0.0, 255.0) as u8;
        pixels[i + 1] = (g + a * ((255.0 - g) - g)).round().clamp(0.0, 255.0) as u8;
        pixels[i + 2] = (b + a * ((255.0 - b) - b)).round().clamp(0.0, 255.0) as u8;
    }
}
