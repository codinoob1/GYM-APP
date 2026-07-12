const fs = require('fs');
const path = require('path');

describe('public/manifest.json', () => {
  const manifestPath = path.join(__dirname, '../public/manifest.json');
  let manifest;

  beforeAll(() => {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    manifest = JSON.parse(raw);
  });

  it('is valid, parseable JSON', () => {
    expect(manifest).toBeInstanceOf(Object);
  });

  it('declares the expected app identity fields', () => {
    expect(manifest.name).toBe('Gym Tracker AI');
    expect(manifest.short_name).toBe('GymAI');
  });

  it('declares navigation fields required for installable PWAs', () => {
    expect(manifest.start_url).toBe('/');
    expect(manifest.scope).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.orientation).toBe('portrait');
  });

  it('declares locale and direction fields', () => {
    expect(manifest.lang).toBe('en-US');
    expect(manifest.dir).toBe('auto');
  });

  it('declares matching theme and background colors', () => {
    expect(manifest.theme_color).toBe('#0a0a0f');
    expect(manifest.background_color).toBe('#0a0a0f');
  });

  it('defines exactly two 512x512 png icons', () => {
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons).toHaveLength(2);

    manifest.icons.forEach((icon) => {
      expect(icon.type).toBe('image/png');
      expect(icon.sizes).toBe('512x512');
      expect(typeof icon.src).toBe('string');
    });
  });

  it('includes one maskable icon and one any-purpose icon', () => {
    const purposes = manifest.icons.map((icon) => icon.purpose).sort();
    expect(purposes).toEqual(['any', 'maskable']);
  });

  it('references icon files that actually exist in /public', () => {
    manifest.icons.forEach((icon) => {
      const iconPath = path.join(__dirname, '../public', icon.src);
      expect(fs.existsSync(iconPath)).toBe(true);
    });
  });

  it('points the maskable and any icons at the expected filenames', () => {
    const maskable = manifest.icons.find((icon) => icon.purpose === 'maskable');
    const anyIcon = manifest.icons.find((icon) => icon.purpose === 'any');

    expect(maskable.src).toBe('icon512_maskable.png');
    expect(anyIcon.src).toBe('icon512_rounded.png');
  });
});