const fs = require('fs');
const path = require('path');

describe('next.config.mjs', () => {
  const configPath = path.join(__dirname, '../next.config.mjs');
  const configSource = fs.readFileSync(configPath, 'utf8');

  it('enables the React Compiler', () => {
    expect(configSource).toMatch(/reactCompiler:\s*true/);
  });

  it('no longer contains the stale placeholder comment', () => {
    expect(configSource).not.toMatch(/config options here/);
  });

  it('exports exactly the expected config object as the default export', async () => {
    const nextConfig = await import('../next.config.mjs');

    expect(nextConfig.default).toEqual({ reactCompiler: true });
  });

  it('does not export any additional unexpected top-level options', async () => {
    const nextConfig = await import('../next.config.mjs');

    expect(Object.keys(nextConfig.default)).toEqual(['reactCompiler']);
  });
});