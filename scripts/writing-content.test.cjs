/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadWriting(site, { read = async () => 'article', list = async () => [] } = {}) {
  const output = ts.transpileModule(fs.readFileSync('src/lib/content/writing.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const remote = {
    parseGitHubRepo: value => value,
    normalizeGitHubPath: value => value,
    normalizeSourceRoot: value => value ?? 'docs/writing',
    listMarkdownFiles: list,
    readMarkdownFile: read,
    parseMarkdown: raw => ({
      frontmatter: { title: raw, slug: raw, type: 'article', status: 'published', date: '2026-10-17', tags: ['AI'], summary: 'A note' },
      body: 'Article body',
    }),
  };
  const customRequire = name => {
    if (name === 'server-only') return {};
    if (name === 'node:fs') return { readFileSync: () => JSON.stringify(site) };
    if (name === '@/lib/content/remote-markdown') return remote;
    return require(name);
  };
  vm.runInNewContext(output, {
    exports: mod.exports, module: mod, require: customRequire,
    process: { cwd: () => process.cwd(), env: { NODE_ENV: 'development' } },
    console: { warn() {} },
  });
  return mod.exports;
}

test('one missing article preserves healthy siblings and other sources', async () => {
  const writing = loadWriting({ writingSources: [
    { repo: 'owner/one', paths: ['good.md', 'missing.md'] },
    { repo: 'owner/two', paths: ['other.md'] },
  ] }, { read: async (_, path) => {
    if (path === 'missing.md') throw new Error('404');
    return path;
  } });
  const result = await writing.getWritingResult();
  assert.equal(result.items.length, 2);
  assert.equal(result.unavailableCount, 1);
  assert.equal((await writing.getWritingBySlug('other.md')).title, 'other.md');
});

test('failed source discovery preserves other sources', async () => {
  const writing = loadWriting({ writingSources: [
    { repo: 'owner/offline' }, { repo: 'owner/healthy', paths: ['healthy.md'] },
  ] }, { list: async () => { throw new Error('network unavailable'); } });
  const result = await writing.getWritingResult();
  assert.equal(result.items.length, 1);
  assert.equal(result.unavailableCount, 1);
});

test('empty publication and unavailable publication have distinct states', async () => {
  const empty = await loadWriting({ writingSources: [] }).getWritingResult();
  assert.equal(empty.items.length, 0);
  assert.equal(empty.unavailableCount, 0);
  const failed = await loadWriting({ writingSources: [{ repo: 'owner/offline', paths: ['missing.md'] }] }, {
    read: async () => { throw new Error('404'); },
  }).getWritingResult();
  assert.equal(failed.items.length, 0);
  assert.equal(failed.unavailableCount, 1);
});

test('duplicate published slugs still surface a content configuration error', async () => {
  const writing = loadWriting({ writingSources: [{ repo: 'owner/one', paths: ['a.md', 'b.md'] }] });
  await assert.rejects(writing.getWriting(), /Duplicate writing slug/);
});
