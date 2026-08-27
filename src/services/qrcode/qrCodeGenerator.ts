/**
 * Pure TypeScript Offline QR Code Generator (ISO/IEC 18004 Standard)
 * Supports Byte Mode encoding for URLs and arbitrary text across Levels L, M, Q, H.
 * Zero external dependencies, 100% offline, deterministic, and verifiable.
 */

export type QRErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

// Galois Field GF(256) tables with primitive polynomial 0x11D (x^8 + x^4 + x^3 + x^2 + 1)
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

for (let i = 0, x = 1; i < 255; i++) {
  EXP_TABLE[i] = x;
  EXP_TABLE[i + 255] = x;
  LOG_TABLE[x] = i;
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
}

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
}

// Reed-Solomon Generator Polynomial expansion: prod_{i=0}^{degree-1} (x + alpha^i)
function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const factor = EXP_TABLE[i];
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return new Uint8Array(poly);
}

// Reed-Solomon Error Correction computation
function rsEncode(data: Uint8Array, ecLength: number): Uint8Array {
  const gen = rsGeneratorPoly(ecLength);
  const buffer = new Uint8Array(data.length + ecLength);
  buffer.set(data);

  for (let i = 0; i < data.length; i++) {
    const coef = buffer[i];
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        buffer[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return buffer.slice(data.length);
}

interface QRVersionSpec {
  version: number;
  totalCodewords: number;
  ecCodewords: Record<
    QRErrorCorrectionLevel,
    {
      ecPerBlock: number;
      blocksGroup1: number;
      dataPerBlockG1: number;
      blocksGroup2: number;
      dataPerBlockG2: number;
    }
  >;
  alignmentPatterns: number[];
}

const QR_VERSION_SPECS: QRVersionSpec[] = [
  {
    version: 1,
    totalCodewords: 26,
    ecCodewords: {
      L: { ecPerBlock: 7, blocksGroup1: 1, dataPerBlockG1: 19, blocksGroup2: 0, dataPerBlockG2: 0 },
      M: { ecPerBlock: 10, blocksGroup1: 1, dataPerBlockG1: 16, blocksGroup2: 0, dataPerBlockG2: 0 },
      Q: { ecPerBlock: 13, blocksGroup1: 1, dataPerBlockG1: 13, blocksGroup2: 0, dataPerBlockG2: 0 },
      H: { ecPerBlock: 17, blocksGroup1: 1, dataPerBlockG1: 9, blocksGroup2: 0, dataPerBlockG2: 0 },
    },
    alignmentPatterns: [],
  },
  {
    version: 2,
    totalCodewords: 44,
    ecCodewords: {
      L: { ecPerBlock: 10, blocksGroup1: 1, dataPerBlockG1: 34, blocksGroup2: 0, dataPerBlockG2: 0 },
      M: { ecPerBlock: 16, blocksGroup1: 1, dataPerBlockG1: 28, blocksGroup2: 0, dataPerBlockG2: 0 },
      Q: { ecPerBlock: 22, blocksGroup1: 1, dataPerBlockG1: 22, blocksGroup2: 0, dataPerBlockG2: 0 },
      H: { ecPerBlock: 28, blocksGroup1: 1, dataPerBlockG1: 16, blocksGroup2: 0, dataPerBlockG2: 0 },
    },
    alignmentPatterns: [6, 18],
  },
  {
    version: 3,
    totalCodewords: 70,
    ecCodewords: {
      L: { ecPerBlock: 15, blocksGroup1: 1, dataPerBlockG1: 55, blocksGroup2: 0, dataPerBlockG2: 0 },
      M: { ecPerBlock: 26, blocksGroup1: 1, dataPerBlockG1: 44, blocksGroup2: 0, dataPerBlockG2: 0 },
      Q: { ecPerBlock: 18, blocksGroup1: 2, dataPerBlockG1: 17, blocksGroup2: 0, dataPerBlockG2: 0 },
      H: { ecPerBlock: 22, blocksGroup1: 2, dataPerBlockG1: 13, blocksGroup2: 0, dataPerBlockG2: 0 },
    },
    alignmentPatterns: [6, 22],
  },
  {
    version: 4,
    totalCodewords: 100,
    ecCodewords: {
      L: { ecPerBlock: 20, blocksGroup1: 1, dataPerBlockG1: 80, blocksGroup2: 0, dataPerBlockG2: 0 },
      M: { ecPerBlock: 18, blocksGroup1: 2, dataPerBlockG1: 32, blocksGroup2: 0, dataPerBlockG2: 0 },
      Q: { ecPerBlock: 26, blocksGroup1: 2, dataPerBlockG1: 24, blocksGroup2: 0, dataPerBlockG2: 0 },
      H: { ecPerBlock: 16, blocksGroup1: 4, dataPerBlockG1: 9, blocksGroup2: 0, dataPerBlockG2: 0 },
    },
    alignmentPatterns: [6, 26],
  },
  {
    version: 5,
    totalCodewords: 134,
    ecCodewords: {
      L: { ecPerBlock: 26, blocksGroup1: 1, dataPerBlockG1: 108, blocksGroup2: 0, dataPerBlockG2: 0 },
      M: { ecPerBlock: 24, blocksGroup1: 2, dataPerBlockG1: 43, blocksGroup2: 0, dataPerBlockG2: 0 },
      Q: { ecPerBlock: 18, blocksGroup1: 2, dataPerBlockG1: 15, blocksGroup2: 2, dataPerBlockG2: 16 },
      H: { ecPerBlock: 22, blocksGroup1: 2, dataPerBlockG1: 11, blocksGroup2: 2, dataPerBlockG2: 12 },
    },
    alignmentPatterns: [6, 30],
  },
  {
    version: 6,
    totalCodewords: 172,
    ecCodewords: {
      L: { ecPerBlock: 18, blocksGroup1: 2, dataPerBlockG1: 68, blocksGroup2: 0, dataPerBlockG2: 0 },
      M: { ecPerBlock: 16, blocksGroup1: 4, dataPerBlockG1: 27, blocksGroup2: 0, dataPerBlockG2: 0 },
      Q: { ecPerBlock: 24, blocksGroup1: 4, dataPerBlockG1: 19, blocksGroup2: 0, dataPerBlockG2: 0 },
      H: { ecPerBlock: 28, blocksGroup1: 4, dataPerBlockG1: 15, blocksGroup2: 0, dataPerBlockG2: 0 },
    },
    alignmentPatterns: [6, 34],
  },
];

class BitBuffer {
  private buffer: number[] = [];
  private length = 0;

  put(num: number, length: number) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit: boolean) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    }
    this.length++;
  }

  getLength(): number {
    return this.length;
  }

  getBytes(): Uint8Array {
    return new Uint8Array(this.buffer);
  }
}

function createDataBits(text: string, version: number, ecLevel: QRErrorCorrectionLevel): Uint8Array {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const spec = QR_VERSION_SPECS[version - 1];
  const ec = spec.ecCodewords[ecLevel];
  const totalDataBytes = ec.blocksGroup1 * ec.dataPerBlockG1 + ec.blocksGroup2 * ec.dataPerBlockG2;

  const bb = new BitBuffer();
  // 1. Mode indicator: Byte mode (0100)
  bb.put(0x4, 4);

  // 2. Character count indicator (8 bits for v1-9, 16 bits for v10+)
  const charCountBits = version < 10 ? 8 : 16;
  bb.put(data.length, charCountBits);

  // 3. Data bytes
  for (let i = 0; i < data.length; i++) {
    bb.put(data[i], 8);
  }

  // 4. Terminator (up to 4 zeroes)
  const bitsNeeded = totalDataBytes * 8;
  const terminatorBits = Math.min(4, bitsNeeded - bb.getLength());
  if (terminatorBits > 0) {
    bb.put(0, terminatorBits);
  }

  // 5. Pad to multiple of 8
  while (bb.getLength() % 8 !== 0) {
    bb.putBit(false);
  }

  // 6. Pad bytes 0xEC, 0x11 until capacity is reached
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bb.getLength() < bitsNeeded) {
    bb.put(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  return bb.getBytes();
}

const FORMAT_INFO_MASK = 0x5412;
const FORMAT_POLY = 0x537;

function getFormatInfoBits(ecLevel: QRErrorCorrectionLevel, mask: number): number {
  const ecBits: Record<QRErrorCorrectionLevel, number> = {
    M: 0,
    L: 1,
    H: 2,
    Q: 3,
  };
  const data = (ecBits[ecLevel] << 3) | mask;
  let d = data << 10;
  for (let i = 14; i >= 10; i--) {
    if ((d >>> i) & 1) {
      d ^= FORMAT_POLY << (i - 10);
    }
  }
  return ((data << 10) | d) ^ FORMAT_INFO_MASK;
}

function isMasked(mask: number, row: number, col: number): boolean {
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

function calculatePenalty(matrix: boolean[][], size: number): number {
  let penalty = 0;

  // N1: 5 or more consecutive modules of same color in rows / cols
  for (let r = 0; r < size; r++) {
    let runColor = matrix[r][0];
    let runLen = 1;
    for (let c = 1; c < size; c++) {
      if (matrix[r][c] === runColor) {
        runLen++;
      } else {
        if (runLen >= 5) penalty += 3 + (runLen - 5);
        runColor = matrix[r][c];
        runLen = 1;
      }
    }
    if (runLen >= 5) penalty += 3 + (runLen - 5);
  }

  for (let c = 0; c < size; c++) {
    let runColor = matrix[0][c];
    let runLen = 1;
    for (let r = 1; r < size; r++) {
      if (matrix[r][c] === runColor) {
        runLen++;
      } else {
        if (runLen >= 5) penalty += 3 + (runLen - 5);
        runColor = matrix[r][c];
        runLen = 1;
      }
    }
    if (runLen >= 5) penalty += 3 + (runLen - 5);
  }

  // N2: 2x2 blocks of same color
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const color = matrix[r][c];
      if (matrix[r + 1][c] === color && matrix[r][c + 1] === color && matrix[r + 1][c + 1] === color) {
        penalty += 3;
      }
    }
  }

  // N3: 1:1:3:1:1 patterns
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size - 10; c++) {
      const p1 = !matrix[r][c] && !matrix[r+1] && !matrix[r][c+2] && !matrix[r][c+3] && matrix[r][c+4] && !matrix[r][c+5] && matrix[r][c+6] && matrix[r][c+7] && matrix[r][c+8] && !matrix[r][c+9] && matrix[r][c+10];
      const p2 = matrix[r][c] && !matrix[r][c+1] && matrix[r][c+2] && matrix[r][c+3] && matrix[r][c+4] && !matrix[r][c+5] && matrix[r][c+6] && !matrix[r][c+7] && !matrix[r][c+8] && !matrix[r][c+9] && !matrix[r][c+10];
      if (p1 || p2) penalty += 40;
    }
  }

  for (let c = 0; c < size; c++) {
    for (let r = 0; r < size - 10; r++) {
      const p1 = !matrix[r][c] && !matrix[r+1][c] && !matrix[r+2][c] && !matrix[r+3][c] && matrix[r+4][c] && !matrix[r+5][c] && matrix[r+6][c] && matrix[r+7][c] && matrix[r+8][c] && !matrix[r+9][c] && matrix[r+10][c];
      const p2 = matrix[r][c] && !matrix[r+1][c] && matrix[r+2][c] && matrix[r+3][c] && matrix[r+4][c] && !matrix[r+5][c] && matrix[r+6][c] && !matrix[r+7][c] && !matrix[r+8][c] && !matrix[r+9][c] && !matrix[r+10][c];
      if (p1 || p2) penalty += 40;
    }
  }

  // N4: Dark module ratio
  let darkCount = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) darkCount++;
    }
  }
  const ratio = (darkCount / (size * size)) * 100;
  const prevMultipleOf5 = Math.floor(ratio / 5) * 5;
  const nextMultipleOf5 = prevMultipleOf5 + 5;
  const k = Math.min(Math.abs(prevMultipleOf5 - 50), Math.abs(nextMultipleOf5 - 50)) / 5;
  penalty += k * 10;

  return penalty;
}

export interface QRMatrixResult {
  matrix: boolean[][];
  size: number;
  version: number;
  ecLevel: QRErrorCorrectionLevel;
}

export function generateQRMatrix(
  text: string,
  preferredEcLevel: QRErrorCorrectionLevel = 'M'
): QRMatrixResult {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);

  let version = 1;
  const ecLevel = preferredEcLevel;
  for (let v = 1; v <= QR_VERSION_SPECS.length; v++) {
    const spec = QR_VERSION_SPECS[v - 1];
    const ec = spec.ecCodewords[ecLevel];
    const capacity = ec.blocksGroup1 * ec.dataPerBlockG1 + ec.blocksGroup2 * ec.dataPerBlockG2;
    if (textBytes.length + 2 <= capacity) {
      version = v;
      break;
    }
  }

  const spec = QR_VERSION_SPECS[version - 1];
  const ec = spec.ecCodewords[ecLevel];
  const dataBytes = createDataBits(text, version, ecLevel);

  const totalBlocks = ec.blocksGroup1 + ec.blocksGroup2;
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];

  let offset = 0;
  for (let b = 0; b < totalBlocks; b++) {
    const dataLen = b < ec.blocksGroup1 ? ec.dataPerBlockG1 : ec.dataPerBlockG2;
    const blockData = dataBytes.slice(offset, offset + dataLen);
    offset += dataLen;
    dataBlocks.push(blockData);
    ecBlocks.push(rsEncode(blockData, ec.ecPerBlock));
  }

  const interleaved: number[] = [];
  const maxDataLen = Math.max(ec.dataPerBlockG1, ec.dataPerBlockG2);
  for (let i = 0; i < maxDataLen; i++) {
    for (let b = 0; b < totalBlocks; b++) {
      if (i < dataBlocks[b].length) {
        interleaved.push(dataBlocks[b][i]);
      }
    }
  }
  for (let i = 0; i < ec.ecPerBlock; i++) {
    for (let b = 0; b < totalBlocks; b++) {
      interleaved.push(ecBlocks[b][i]);
    }
  }

  const size = version * 4 + 17;
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunctionModule = (r: number, c: number, val: boolean) => {
    matrix[r][c] = val;
    isFunction[r][c] = true;
  };

  const addFinderPattern = (startR: number, startC: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = startR + r;
        const col = startC + c;
        if (row >= 0 && row < size && col >= 0 && col < size) {
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isDark = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
            setFunctionModule(row, col, isDark);
          } else {
            setFunctionModule(row, col, false);
          }
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(0, size - 7);
  addFinderPattern(size - 7, 0);

  const alignCoords = spec.alignmentPatterns;
  if (alignCoords.length >= 2) {
    for (const r of alignCoords) {
      for (const c of alignCoords) {
        if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8)) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isDark = (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0));
            setFunctionModule(r + dr, c + dc, isDark);
          }
        }
      }
    }
  }

  for (let i = 8; i < size - 8; i++) {
    const isDark = i % 2 === 0;
    if (!isFunction[6][i]) setFunctionModule(6, i, isDark);
    if (!isFunction[i][6]) setFunctionModule(i, 6, isDark);
  }

  setFunctionModule(4 * version + 9, 8, true);

  for (let i = 0; i < 9; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true;
    if (!isFunction[i][8]) isFunction[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    if (!isFunction[8][size - 1 - i]) isFunction[8][size - 1 - i] = true;
    if (!isFunction[size - 1 - i][8]) isFunction[size - 1 - i][8] = true;
  }

  const dataBits: boolean[] = [];
  for (const byte of interleaved) {
    for (let bit = 7; bit >= 0; bit--) {
      dataBits.push(((byte >>> bit) & 1) === 1);
    }
  }

  let bitIdx = 0;
  let dir = -1;
  let c = size - 1;

  while (c > 0) {
    if (c === 6) c--;
    const rStart = dir === -1 ? size - 1 : 0;
    const rEnd = dir === -1 ? -1 : size;

    for (let r = rStart; r !== rEnd; r += (dir === -1 ? -1 : 1)) {
      for (let colOffset = 0; colOffset < 2; colOffset++) {
        const col = c - colOffset;
        if (!isFunction[r][col]) {
          const bitVal = bitIdx < dataBits.length ? dataBits[bitIdx] : false;
          matrix[r][col] = bitVal;
          bitIdx++;
        }
      }
    }
    dir = -dir as -1 | 1;
    c -= 2;
  }

  let bestMask = 0;
  let bestPenalty = Infinity;
  let bestMatrix: boolean[][] = [];

  for (let mask = 0; mask < 8; mask++) {
    const candidate: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    for (let r = 0; r < size; r++) {
      for (let col = 0; col < size; col++) {
        if (isFunction[r][col]) {
          candidate[r][col] = matrix[r][col] ?? false;
        } else {
          const raw = matrix[r][col] ?? false;
          candidate[r][col] = isMasked(mask, r, col) ? !raw : raw;
        }
      }
    }

    const formatInfo = getFormatInfoBits(ecLevel, mask);
    const formatBits: boolean[] = [];
    for (let i = 0; i < 15; i++) {
      formatBits.push(((formatInfo >>> i) & 1) === 1);
    }

    // Top-Left around finder:
    candidate[8][0] = formatBits[0];
    candidate[8][1] = formatBits[1];
    candidate[8][2] = formatBits[2];
    candidate[8][3] = formatBits[3];
    candidate[8][4] = formatBits[4];
    candidate[8][5] = formatBits[5];
    candidate[8][7] = formatBits[6];
    candidate[8][8] = formatBits[7];
    candidate[7][8] = formatBits[8];
    candidate[5][8] = formatBits[9];
    candidate[4][8] = formatBits[10];
    candidate[3][8] = formatBits[11];
    candidate[2][8] = formatBits[12];
    candidate[1][8] = formatBits[13];
    candidate[0][8] = formatBits[14];

    // Bottom-Left (under finder, bits 0..6):
    for (let i = 0; i < 7; i++) {
      candidate[size - 1 - i][8] = formatBits[i];
    }
    // Top-Right (under finder, bits 7..14):
    for (let i = 0; i < 8; i++) {
      candidate[8][size - 8 + i] = formatBits[7 + i];
    }

    const penalty = calculatePenalty(candidate, size);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestMask = mask;
      bestMatrix = candidate;
    }
  }

  return {
    matrix: bestMatrix,
    size,
    version,
    ecLevel,
  };
}
