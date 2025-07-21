// src/utils/mathHelpers.js
import { parse } from 'mathjs';

export function toLatex(plainText) {
  if (typeof plainText !== 'string' || !plainText.trim()) {
    return "";
  }
  
  // === STEP 1: PRE-PROCESSING ===
  // Translate your special characters into a format math.js understands.
  let expression = plainText
    .replace(/sin²θ/gi, 'sin(theta)^2')
    .replace(/cos²θ/gi, 'cos(theta)^2')
    .replace(/tan²θ/gi, 'tan(theta)^2')
    .replace(/sec²θ/gi, 'sec(theta)^2')
    .replace(/cosec²θ/gi, 'csc(theta)^2')
    .replace(/cot²θ/gi, 'cot(theta)^2')
    .replace(/sinθ/gi, 'sin(theta)')
    .replace(/cosθ/gi, 'cos(theta)')
    .replace(/tanθ/gi, 'tan(theta)')
    .replace(/secθ/gi, 'sec(theta)')
    .replace(/cosecθ/gi, 'csc(theta)')
    .replace(/cotθ/gi, 'cot(theta)')
    .replace(/θ/g, 'theta');

  try {
    // === STEP 2: PARSING WITH MATH.JS ===
    const node = parse(expression);
    let latexOutput = node.toTex();

    // === STEP 3: POST-PROCESSING (THE FIX) ===
    // Clean up the output from math.js to match your desired style.
    // This will turn `\sin\left(\theta\right)` into `\sin{\theta}`.
    latexOutput = latexOutput.replace(/\\left\(\\theta\\right\)/g, '{\\theta}');

    return latexOutput;

  } catch (error) {
    // Fallback for non-mathematical text
    return `\\text{${plainText}}`;
  }
}