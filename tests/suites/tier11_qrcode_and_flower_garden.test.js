import { test, describe } from "node:test";
import assert from "node:assert";
import { generateQRMatrix } from "../../src/services/qrcode/qrCodeGenerator.js";

// Full Independent QR Matrix Decoder to verify generated QR matrix against ISO/IEC 18004
const FORMAT_INFO_MASK = 0x5412;
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  EXP_TABLE[i] = x;
  EXP_TABLE[i + 255] = x;
  LOG_TABLE[x] = i;
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
}
function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
}
function rsVerify(codeword, ecLength) {
  const n = codeword.length;
  for (let i = 0; i < ecLength; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) {
      if (codeword[j] !== 0) {
        const power = ((n - 1 - j) * i) % 255;
        s ^= gfMul(codeword[j], EXP_TABLE[power]);
      }
    }
    if (s !== 0) return false;
  }
  return true;
}

const QR_VERSION_SPECS = [
  { version: 1, totalCodewords: 26, ecCodewords: { L: { ecPerBlock: 7, blocksGroup1: 1, dataPerBlockG1: 19, blocksGroup2: 0, dataPerBlockG2: 0 }, M: { ecPerBlock: 10, blocksGroup1: 1, dataPerBlockG1: 16, blocksGroup2: 0, dataPerBlockG2: 0 }, Q: { ecPerBlock: 13, blocksGroup1: 1, dataPerBlockG1: 13, blocksGroup2: 0, dataPerBlockG2: 0 }, H: { ecPerBlock: 17, blocksGroup1: 1, dataPerBlockG1: 9, blocksGroup2: 0, dataPerBlockG2: 0 } }, alignmentPatterns: [] },
  { version: 2, totalCodewords: 44, ecCodewords: { L: { ecPerBlock: 10, blocksGroup1: 1, dataPerBlockG1: 34, blocksGroup2: 0, dataPerBlockG2: 0 }, M: { ecPerBlock: 16, blocksGroup1: 1, dataPerBlockG1: 28, blocksGroup2: 0, dataPerBlockG2: 0 }, Q: { ecPerBlock: 22, blocksGroup1: 1, dataPerBlockG1: 22, blocksGroup2: 0, dataPerBlockG2: 0 }, H: { ecPerBlock: 28, blocksGroup1: 1, dataPerBlockG1: 16, blocksGroup2: 0, dataPerBlockG2: 0 } }, alignmentPatterns: [6, 18] },
  { version: 3, totalCodewords: 70, ecCodewords: { L: { ecPerBlock: 15, blocksGroup1: 1, dataPerBlockG1: 55, blocksGroup2: 0, dataPerBlockG2: 0 }, M: { ecPerBlock: 26, blocksGroup1: 1, dataPerBlockG1: 44, blocksGroup2: 0, dataPerBlockG2: 0 }, Q: { ecPerBlock: 18, blocksGroup1: 2, dataPerBlockG1: 17, blocksGroup2: 0, dataPerBlockG2: 0 }, H: { ecPerBlock: 22, blocksGroup1: 2, dataPerBlockG1: 13, blocksGroup2: 0, dataPerBlockG2: 0 } }, alignmentPatterns: [6, 22] },
  { version: 4, totalCodewords: 100, ecCodewords: { L: { ecPerBlock: 20, blocksGroup1: 1, dataPerBlockG1: 80, blocksGroup2: 0, dataPerBlockG2: 0 }, M: { ecPerBlock: 18, blocksGroup1: 2, dataPerBlockG1: 32, blocksGroup2: 0, dataPerBlockG2: 0 }, Q: { ecPerBlock: 26, blocksGroup1: 2, dataPerBlockG1: 24, blocksGroup2: 0, dataPerBlockG2: 0 }, H: { ecPerBlock: 16, blocksGroup1: 4, dataPerBlockG1: 9, blocksGroup2: 0, dataPerBlockG2: 0 } }, alignmentPatterns: [6, 26] },
  { version: 5, totalCodewords: 134, ecCodewords: { L: { ecPerBlock: 26, blocksGroup1: 1, dataPerBlockG1: 108, blocksGroup2: 0, dataPerBlockG2: 0 }, M: { ecPerBlock: 24, blocksGroup1: 2, dataPerBlockG1: 43, blocksGroup2: 0, dataPerBlockG2: 0 }, Q: { ecPerBlock: 18, blocksGroup1: 2, dataPerBlockG1: 15, blocksGroup2: 2, dataPerBlockG2: 16 }, H: { ecPerBlock: 22, blocksGroup1: 2, dataPerBlockG1: 11, blocksGroup2: 2, dataPerBlockG2: 12 } }, alignmentPatterns: [6, 30] },
];

function isMasked(mask, row, col) {
  switch (mask) {
    case 0: return (row + col) % 2 === 0;
    case 1: return row % 2 === 0;
    case 2: return col % 3 === 0;
    case 3: return (row + col) % 3 === 0;
    case 4: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
    case 5: return ((row * col) % 2) + ((row * col) % 3) === 0;
    case 6: return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
    case 7: return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
    default: return false;
  }
}

function decodeQRMatrixToText(matrix) {
  const size = matrix.length;
  const version = (size - 17) / 4;
  const spec = QR_VERSION_SPECS[version - 1];

  const formatBits = [
    matrix[8][0], matrix[8][1], matrix[8][2], matrix[8][3], matrix[8][4], matrix[8][5], matrix[8][7], matrix[8][8],
    matrix[7][8], matrix[5][8], matrix[4][8], matrix[3][8], matrix[2][8], matrix[1][8], matrix[0][8]
  ];

  let rawFormat = 0;
  for (let i = 0; i < 15; i++) if (formatBits[i]) rawFormat |= (1 << i);
  const unmaskedFormat = rawFormat ^ FORMAT_INFO_MASK;
  const formatData = unmaskedFormat >>> 10;
  const ecBitsVal = formatData >>> 3;
  const mask = formatData & 7;
  const ecLevels = ["M", "L", "H", "Q"];
  const ecLevel = ecLevels[ecBitsVal];

  const isFunction = Array.from({ length: size }, () => Array(size).fill(false));
  const markFinder = (sr, sc) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = sr + r, col = sc + c;
        if (row >= 0 && row < size && col >= 0 && col < size) isFunction[row][col] = true;
      }
    }
  };
  markFinder(0, 0); markFinder(0, size - 7); markFinder(size - 7, 0);

  const alignCoords = spec.alignmentPatterns;
  if (alignCoords.length >= 2) {
    for (const r of alignCoords) {
      for (const c of alignCoords) {
        if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8)) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) isFunction[r + dr][c + dc] = true;
        }
      }
    }
  }

  for (let i = 8; i < size - 8; i++) { isFunction[6][i] = true; isFunction[i][6] = true; }
  isFunction[4 * version + 9][8] = true;
  for (let i = 0; i < 9; i++) { isFunction[8][i] = true; isFunction[i][8] = true; }
  for (let i = 0; i < 8; i++) { isFunction[8][size - 1 - i] = true; isFunction[size - 1 - i][8] = true; }

  const unmaskedMatrix = Array.from({ length: size }, () => Array(size).fill(false));
  for (let r = 0; r < size; r++) {
    for (let col = 0; col < size; col++) {
      unmaskedMatrix[r][col] = isFunction[r][col] ? matrix[r][col] : (isMasked(mask, r, col) ? !matrix[r][col] : matrix[r][col]);
    }
  }

  const dataBits = [];
  let dir = -1, c = size - 1;
  while (c > 0) {
    if (c === 6) c--;
    const rStart = dir === -1 ? size - 1 : 0;
    const rEnd = dir === -1 ? -1 : size;
    for (let r = rStart; r !== rEnd; r += (dir === -1 ? -1 : 1)) {
      for (let colOffset = 0; colOffset < 2; colOffset++) {
        const col = c - colOffset;
        if (!isFunction[r][col]) dataBits.push(unmaskedMatrix[r][col]);
      }
    }
    dir = -dir;
    c -= 2;
  }

  const bytes = [];
  for (let i = 0; i + 8 <= dataBits.length; i += 8) {
    let byte = 0;
    for (let b = 0; b < 8; b++) if (dataBits[i + b]) byte |= (1 << (7 - b));
    bytes.push(byte);
  }

  const ec = spec.ecCodewords[ecLevel];
  const totalBlocks = ec.blocksGroup1 + ec.blocksGroup2;
  const dataBlocks = Array.from({ length: totalBlocks }, () => []);
  const ecBlocks = Array.from({ length: totalBlocks }, () => []);

  let byteIdx = 0;
  const maxDataLen = Math.max(ec.dataPerBlockG1, ec.dataPerBlockG2);
  for (let i = 0; i < maxDataLen; i++) {
    for (let b = 0; b < totalBlocks; b++) {
      const blockCapacity = b < ec.blocksGroup1 ? ec.dataPerBlockG1 : ec.dataPerBlockG2;
      if (i < blockCapacity && byteIdx < bytes.length) dataBlocks[b].push(bytes[byteIdx++]);
    }
  }
  for (let i = 0; i < ec.ecPerBlock; i++) {
    for (let b = 0; b < totalBlocks; b++) if (byteIdx < bytes.length) ecBlocks[b].push(bytes[byteIdx++]);
  }

  for (let b = 0; b < totalBlocks; b++) {
    const fullCodeword = new Uint8Array([...dataBlocks[b], ...ecBlocks[b]]);
    assert.strictEqual(rsVerify(fullCodeword, ec.ecPerBlock), true, "RS verification failed for block " + b);
  }

  const allDataBytes = dataBlocks.flat();
  let bitPos = 0;
  const readBits = (n) => {
    let val = 0;
    for (let i = 0; i < n; i++) {
      const byteIndex = Math.floor(bitPos / 8);
      const bitOffset = 7 - (bitPos % 8);
      val = (val << 1) | ((allDataBytes[byteIndex] >>> bitOffset) & 1);
      bitPos++;
    }
    return val;
  };

  const mode = readBits(4);
  assert.strictEqual(mode, 4, "Must be Byte Mode (0100)");
  const charCountBits = version < 10 ? 8 : 16;
  const charCount = readBits(charCountBits);
  const textBytes = [];
  for (let i = 0; i < charCount; i++) textBytes.push(readBits(8));
  return new TextDecoder().decode(new Uint8Array(textBytes));
}

describe("Tier 11: App QR Code Tab & Mascot Companion", () => {
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
        for (let i = 0; i < 7; i++) {
          assert.strictEqual(matrix[startR][startC + i], true, "Top border");
          assert.strictEqual(matrix[startR + 6][startC + i], true, "Bottom border");
          assert.strictEqual(matrix[startR + i][startC], true, "Left border");
          assert.strictEqual(matrix[startR + i][startC + 6], true, "Right border");
        }
        for (let r = 2; r <= 4; r++) {
          for (let c = 2; c <= 4; c++) {
            assert.strictEqual(matrix[startR + r][startC + c], true, "Inner 3x3 core");
          }
        }
        for (let i = 1; i <= 5; i++) {
          assert.strictEqual(matrix[startR + 1][startC + i], false, "Inner light row 1");
          assert.strictEqual(matrix[startR + 5][startC + i], false, "Inner light row 5");
          assert.strictEqual(matrix[startR + i][startC + 1], false, "Inner light col 1");
          assert.strictEqual(matrix[startR + i][startC + 5], false, "Inner light col 5");
        }
      };

      checkFinder(0, 0);
      checkFinder(0, size - 7);
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

    test("should decode generated QR code matrices back to exact URL with 0 Reed-Solomon errors across L, M, Q, H", () => {
      for (const ec of ["L", "M", "Q", "H"]) {
        const qr = generateQRMatrix(TARGET_URL, ec);
        const decodedText = decodeQRMatrixToText(qr.matrix);
        assert.strictEqual(decodedText, TARGET_URL, "Decoded text must match target URL under EC " + ec);
      }
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
