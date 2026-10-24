const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const path = require('node:path');
const { test } = require('node:test');

const fromPackage = (name) => createRequire(require.resolve(name + '/package.json'));

test('Metro reads PNG buffers through its patched image parser', () => {
  const metroRoot = path.dirname(require.resolve('metro/package.json'));
  const { getAssetSize } = require(path.join(metroRoot, 'src/Assets.js'));
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aTHsAAAAASUVORK5CYII=', 'base64');
  assert.deepEqual(getAssetSize('png', png, 'fixture.png'), { width: 1, height: 1 });
  assert.throws(() => getAssetSize('png', Buffer.alloc(0), 'empty.png'));
  assert.equal(getAssetSize('txt', Buffer.from('text'), 'fixture.txt'), null);
});

test('Expo Metro PostCSS override retains parsing and transformation APIs', async () => {
  const postcss = fromPackage('@expo/metro-config')('postcss');
  const result = await postcss([{
    postcssPlugin: 'compatibility-fixture',
    Declaration(decl) { if (decl.prop === 'color') decl.value = 'blue'; },
  }]).process('.fixture { color: red }', { from: undefined, map: false });
  assert.match(result.css, /color: blue/);
  assert.equal(postcss.parse(result.css).first.selector, '.fixture');
});

test('Expo Router query serialization preserves encoded route parameters', () => {
  const query = fromPackage('expo-router')('query-string');
  assert.equal(query.stringify({ name: '日本語', percent: '%FF' }, { sort: false }),
    'name=%E6%97%A5%E6%9C%AC%E8%AA%9E&percent=%25FF');
});

test('Metro bundles disk PNG assets and density variants without path decoding errors', async () => {
  const fs = require('node:fs');
  const os = require('node:os');
  const metroRoot = path.dirname(require.resolve('metro/package.json'));
  const { getAssetData } = require(path.join(metroRoot, 'src/Assets.js'));
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'metro-asset-compat-'));
  const file = path.join(directory, 'fixture.png');
  const retinaFile = path.join(directory, 'fixture@2x.png');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aTHsAAAAASUVORK5CYII=', 'base64');
  try {
    fs.writeFileSync(file, png);
    fs.writeFileSync(retinaFile, png);
    const asset = await getAssetData(file, 'fixture.png', [], 'ios', '/assets');
    assert.equal(asset.width, 1);
    assert.equal(asset.height, 1);
    assert.deepEqual(asset.scales, [1, 2]);
    assert.deepEqual(asset.files, [file, retinaFile]);
    assert.equal(asset.__packager_asset, true);
  } finally {
    for (const fixture of [file, retinaFile]) {
      if (fs.existsSync(fixture)) fs.unlinkSync(fixture);
    }
    fs.rmdirSync(directory);
  }
});
