// src/utils/mathHelpers.js
import { parse } from 'mathjs';

// This function now correctly handles both problem titles and pure math expressions.
export function toLatex(plainText, { forModal = false } = {}) {
  if (typeof plainText !== 'string' || !plainText.trim()) {
    return "";
  }

  // --- NEW LOGIC: Manually handle problem titles ---
  // If the string is a problem title, we format it directly for LaTeX display
  // and bypass the math.js parser which causes the error.
  if (plainText.startsWith('Prove:')) {
    let formattedText = plainText;

    // Step 1: Handle the line break marker.
    if (forModal) {
      // For the modal, replace @@ with the LaTeX line break command.
      formattedText = formattedText.replace(/@@/g, '\\\\');
    } else {
      // For the main screen, just remove it.
      formattedText = formattedText.replace(/@@/g, '');
    }

    // Step 2: Manually replace math symbols with their LaTeX equivalents.
    // This is more reliable for display than using the parser.
    return formattedText
      .replace(/sin²θ/gi, '\\sin^2{\\theta}')
      .replace(/cos²θ/gi, '\\cos^2{\\theta}')
      .replace(/tan²θ/gi, '\\tan^2{\\theta}')
      .replace(/sec²θ/gi, '\\sec^2{\\theta}')
      .replace(/cosec²θ/gi, '\\csc^2{\\theta}')
      .replace(/cot²θ/gi, '\\cot^2{\\theta}')
      .replace(/sinθ/gi, '\\sin{\\theta}')
      .replace(/cosθ/gi, '\\cos{\\theta}')
      .replace(/tanθ/gi, '\\tan{\\theta}')
      .replace(/secθ/gi, '\\sec{\\theta}')
      .replace(/cosecθ/gi, '\\csc{\\theta}')
      .replace(/cotθ/gi, '\\cot{\\theta}')
      .replace(/θ/g, '{\\theta}');
  }
  // --- END OF NEW LOGIC ---


  // --- EXISTING LOGIC for pure mathematical expressions (from steps/choices) ---
  // This part remains unchanged and will handle all other cases.
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
    const node = parse(expression);
    let latexOutput = node.toTex();
    latexOutput = latexOutput.replace(/\\left\(\\theta\\right\)/g, '{\\theta}');
    return latexOutput;
  } catch (error) {
    return `\\text{${plainText}}`;
  }
}