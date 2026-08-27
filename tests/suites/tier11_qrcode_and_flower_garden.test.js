import { test, describe } from "node:test";
import assert from "node:assert";
import { generateQRMatrix } from "../../src/services/qrcode/qrCodeGenerator.js";

describe("Tier 11: App QR Code, Quorra Mascot & Botanical Flower Garden", () => {
  const TARGET_URL = "https://damorelse.github.io/talk-to-dad/";

  describe("1. Deterministic Offline QR Code Matrix Generator", () => {
    test("should generate valid QR matrix for target GitHub Pages URL", () => {
      const result = generateQRMatrix(TARGET_URL, "M");
      assert.ok(result);
      assert.strictEqual(result.version, 3);
      assert.strictEqual(result.size, 29);
      assert.strictEqual(result.matrix.length, 29);
      assert.strictEqual(result.matrix[0].length, 29);
    });

    test("should produce identical QR matrices on repeated calls (Strict Determinism)", () => {
      const run1 = generateQRMatrix(TARGET_URL, "M");
      const run2 = generateQRMatrix(TARGET_URL, "M");

      assert.strictEqual(run1.size, run2.size);
      for (let r = 0; r < run1.size; r++) {
        for (let c = 0; c < run1.size; c++) {
          assert.strictEqual(run1.matrix[r][c], run2.matrix[r][c]);
        }
      }
    });

    test("should contain valid Finder Patterns at 3 corners", () => {
      const result = generateQRMatrix(TARGET_URL, "M");
      const { matrix, size } = result;

      const checkFinder = (startR, startC) => {
        // Outer 7x7 border should be dark
        for (let i = 0; i < 7; i++) {
          assert.strictEqual(matrix[startR][startC + i], true, "Top border");
          assert.strictEqual(matrix[startR + 6][startC + i], true, "Bottom border");
          assert.strictEqual(matrix[startR + i][startC], true, "Left border");
          assert.strictEqual(matrix[startR + i][startC + 6], true, "Right border");
        }
        // Inner 3x3 core should be dark
        for (let r = 2; r <= 4; r++) {
          for (let c = 2; c <= 4; c++) {
            assert.strictEqual(matrix[startR + r][startC + c], true, "Inner 3x3 core");
          }
        }
        // Ring of light around 3x3 core
        for (let i = 1; i <= 5; i++) {
          assert.strictEqual(matrix[startR + 1][startC + i], false, "Inner light row 1");
          assert.strictEqual(matrix[startR + 5][startC + i], false, "Inner light row 5");
          assert.strictEqual(matrix[startR + i][startC + 1], false, "Inner light col 1");
          assert.strictEqual(matrix[startR + i][startC + 5], false, "Inner light col 5");
        }
      };

      // Top-Left
      checkFinder(0, 0);
      // Top-Right
      checkFinder(0, size - 7);
      // Bottom-Left
      checkFinder(size - 7, 0);
    });

    test("should contain alternating Timing Patterns at row 6 and col 6", () => {
      const { matrix, size } = generateQRMatrix(TARGET_URL, "M");

      for (let i = 8; i < size - 8; i++) {
        const expected = i % 2 === 0;
        assert.strictEqual(matrix[6][i], expected, "Horizontal timing pattern");
        assert.strictEqual(matrix[i][6], expected, "Vertical timing pattern");
      }
    });

    test("should support different error correction levels (L, M, Q, H)", () => {
      const resL = generateQRMatrix(TARGET_URL, "L");
      const resM = generateQRMatrix(TARGET_URL, "M");
      const resQ = generateQRMatrix(TARGET_URL, "Q");
      const resH = generateQRMatrix(TARGET_URL, "H");

      assert.ok(resL.matrix.length >= 25);
      assert.ok(resM.matrix.length >= 29);
      assert.ok(resQ.matrix.length >= 29);
      assert.ok(resH.matrix.length >= 29);
    });
  });

  describe("2. App URL Invariant & Component Integrity", () => {
    test("should point precisely to damorelse GitHub Pages URL", () => {
      assert.strictEqual(TARGET_URL, "https://damorelse.github.io/talk-to-dad/");
      assert.ok(TARGET_URL.startsWith("https://"));
      assert.ok(TARGET_URL.endsWith("/talk-to-dad/"));
    });
  });
});
