const fs = require('fs');
const path = require('path');

describe('package.json PWA (serwist) dependencies', () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
  );

  it('declares the serwist packages required for PWA support', () => {
    expect(pkg.dependencies).toHaveProperty('serwist');
    expect(pkg.dependencies).toHaveProperty('@serwist/next');
    expect(pkg.dependencies).toHaveProperty('@serwist/turbopack');
  });

  it('pins the serwist related dependencies to the same version range', () => {
    expect(pkg.dependencies.serwist).toBe('^9.5.11');
    expect(pkg.dependencies['@serwist/next']).toBe('^9.5.11');
    expect(pkg.dependencies['@serwist/turbopack']).toBe('^9.5.11');
  });
});

describe('package-lock.json', () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
  );
  const lock = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package-lock.json'), 'utf8')
  );

  it('is valid JSON using the npm lockfile v3 format', () => {
    expect(lock.lockfileVersion).toBe(3);
    expect(lock.packages).toBeInstanceOf(Object);
  });

  it('keeps the root package dependencies in sync with package.json', () => {
    const rootPackage = lock.packages[''];

    expect(rootPackage).toBeDefined();
    expect(rootPackage.dependencies).toEqual(pkg.dependencies);
  });

  it('locks resolved versions for the newly added serwist packages', () => {
    expect(lock.packages['node_modules/serwist']).toBeDefined();
    expect(lock.packages['node_modules/serwist'].version).toBe('9.5.11');

    expect(lock.packages['node_modules/@serwist/next']).toBeDefined();
    expect(lock.packages['node_modules/@serwist/next'].version).toBe('9.5.11');

    expect(lock.packages['node_modules/@serwist/turbopack']).toBeDefined();
    expect(lock.packages['node_modules/@serwist/turbopack'].version).toBe(
      '9.5.11'
    );
  });

  it('does not list a top-level dependency that is missing from package.json', () => {
    const lockDeps = Object.keys(lock.packages[''].dependencies || {});

    lockDeps.forEach((dep) => {
      expect(pkg.dependencies).toHaveProperty(dep);
    });
  });
});