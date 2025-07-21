// src/data/gameData.js
// This file contains all the static data for the game.

export const formulas = [
    { id: "pythagorean1", text: "sin²θ + cos²θ = 1", type: "pythagorean" },
    { id: "pythagorean2", text: "1 + tan²θ = sec²θ", type: "pythagorean" },
    { id: "pythagorean2_alt", text: "sec²θ - tan²θ = 1", type: "pythagorean" },
    { id: "pythagorean3", text: "1 + cot²θ = cosec²θ", type: "pythagorean" },
    { id: "pythagorean3_alt", text: "cosec²θ - cot²θ = 1", type: "pythagorean" },
    { id: "quotient1", text: "tanθ = sinθ / cosθ", type: "quotient" },
    { id: "quotient2", text: "cotθ = cosθ / sinθ", type: "quotient" },
    { id: "reciprocal1", text: "secθ = 1 / cosθ", type: "reciprocal" },
    { id: "reciprocal2", text: "cosecθ = 1 / sinθ", type: "reciprocal" },
    { id: "reciprocal3", text: "cotθ = 1 / tanθ", type: "reciprocal" },
    { id: "algebra_diff_squares", text: "a² - b² = (a - b)(a + b)", type: "algebraic" },
    { id: "algebra_factor", text: "Factor out common term", type: "algebraic" },
    { id: "algebra_cancel", text: "Cancel common factors", type: "algebraic" },
    { id: "algebra_combine_fractions", text: "Combine fractions", type: "algebraic" },
    { id: "algebra_simplify_expression", text: "Simplify algebraic expression", type: "algebraic" },
];

export const problems = {
    "1": {
        id: "problem1",
        title: "Prove: (tanθ + secθ - 1) / (tanθ - secθ + 1) = (1 + sinθ) / cosθ",
        moves: { easy: 40, medium: 30, hard: 25 },
        // === CHANGE: Added score thresholds for stars ===
        scoreThresholds: { oneStar: 8000, twoStars: 12000, threeStars: 15000 },
        steps: [
            { currentLHS: "(tanθ + secθ - 1) / (tanθ - secθ + 1)", explanation: "Replace '1' in the numerator using sec²θ - tan²θ = 1.", correctFormulaId: "pythagorean2_alt", distractorFormulaIds: ["pythagorean1", "quotient1", "reciprocal1"], nextLHS: "(tanθ + secθ - (sec²θ - tan²θ)) / (tanθ - secθ + 1)" },
            { currentLHS: "(tanθ + secθ - (sec²θ - tan²θ)) / (tanθ - secθ + 1)", explanation: "Factor the difference of squares: sec²θ - tan²θ.", correctFormulaId: "algebra_diff_squares", distractorFormulaIds: ["pythagorean2", "quotient2", "reciprocal2"], nextLHS: "(tanθ + secθ - (secθ - tanθ)(secθ + tanθ)) / (tanθ - secθ + 1)" },
            { currentLHS: "(tanθ + secθ - (secθ - tanθ)(secθ + tanθ)) / (tanθ - secθ + 1)", explanation: "Factor out the common term (tanθ + secθ) from the numerator.", correctFormulaId: "algebra_factor", distractorFormulaIds: ["pythagorean1", "quotient1", "pythagorean3"], nextLHS: "((tanθ + secθ) * (1 - (secθ - tanθ))) / (tanθ - secθ + 1)" },
            { currentLHS: "((tanθ + secθ) * (1 - (secθ - tanθ))) / (tanθ - secθ + 1)", explanation: "Simplify the expression (1 - (secθ - tanθ)) in the numerator.", correctFormulaId: "algebra_simplify_expression", distractorFormulaIds: ["pythagorean1", "reciprocal1", "quotient1"], nextLHS: "((tanθ + secθ) * (1 - secθ + tanθ)) / (tanθ - secθ + 1)" },
            { currentLHS: "((tanθ + secθ) * (1 - secθ + tanθ)) / (tanθ - secθ + 1)", explanation: "Cancel the common factor (1 - secθ + tanθ).", correctFormulaId: "algebra_cancel", distractorFormulaIds: ["pythagorean2_alt", "quotient2", "reciprocal3"], nextLHS: "tanθ + secθ" },
            { currentLHS: "tanθ + secθ", explanation: "Convert tanθ to sinθ/cosθ.", correctFormulaId: "quotient1", distractorFormulaIds: ["quotient2", "pythagorean1", "reciprocal1"], nextLHS: "(sinθ / cosθ) + secθ" },
            { currentLHS: "(sinθ / cosθ) + secθ", explanation: "Convert secθ to 1/cosθ.", correctFormulaId: "reciprocal1", distractorFormulaIds: ["reciprocal2", "pythagorean2", "quotient1"], nextLHS: "(sinθ / cosθ) + (1 / cosθ)" },
            { currentLHS: "(sinθ / cosθ) + (1 / cosθ)", explanation: "Combine the fractions over the common denominator.", correctFormulaId: "algebra_combine_fractions", distractorFormulaIds: ["pythagorean1", "quotient2", "reciprocal3"], nextLHS: "(sinθ + 1) / cosθ" }
        ]
    },
    "2": {
        id: "problem2",
        title: "Prove: sin²θ / (1 - cosθ) = 1 + cosθ (assuming 1 - cosθ ≠ 0)",
        moves: { easy: 20, medium: 15, hard: 10 },
        // === CHANGE: Added score thresholds for stars ===
        scoreThresholds: { oneStar: 3000, twoStars: 5000, threeStars: 7000 },
        steps: [
            { currentLHS: "sin²θ / (1 - cosθ)", explanation: "Replace sin²θ using sin²θ + cos²θ = 1.", correctFormulaId: "pythagorean1", distractorFormulaIds: ["pythagorean2", "quotient1", "reciprocal1"], nextLHS: "(1 - cos²θ) / (1 - cosθ)" },
            { currentLHS: "(1 - cos²θ) / (1 - cosθ)", explanation: "Factor the numerator (1 - cos²θ) as a difference of squares.", correctFormulaId: "algebra_diff_squares", distractorFormulaIds: ["pythagorean2_alt", "algebra_factor", "quotient2"], nextLHS: "((1 - cosθ)(1 + cosθ)) / (1 - cosθ)" },
            { currentLHS: "((1 - cosθ)(1 + cosθ)) / (1 - cosθ)", explanation: "Cancel the common factor (1 - cosθ).", correctFormulaId: "algebra_cancel", distractorFormulaIds: ["pythagorean1", "reciprocal2", "quotient1"], nextLHS: "1 + cosθ" }
        ]
    }
};

export const getFormulaById = (id) => formulas.find(f => f.id === id);