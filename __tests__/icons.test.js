const fs = require('fs');
const path = require('path');

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe.each([['icon512_maskable.png'], ['icon512_rounded.png']])(
  'public/%s',
  (filename) => {
    const filePath = path.join(__dirname, '../public', filename);

    it('exists on disk', () => {
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('is a non-empty, valid PNG file', () => {
      const buffer = fs.readFileSync(filePath);

      expect(buffer.length).toBeGreaterThan(0);
      expect(buffer.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
    });
  }
);