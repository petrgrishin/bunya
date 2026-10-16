'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');

const projectRoot = path.resolve(__dirname, '..');

function assertSnapshot(entryPoint) {
    const result = spawnSync(process.execPath, [path.join(projectRoot, entryPoint)], {
        cwd: projectRoot,
        input: readFileSync(path.join(__dirname, 'snapshots', 'log.json')),
        encoding: 'utf8',
        env: {
            ...process.env,
            TZ: 'Europe/Moscow',
            FORCE_COLOR: '0',
        },
        timeout: 5000,
    });

    assert.ifError(result.error);
    assert.strictEqual(result.signal, null, 'CLI should not be terminated by a signal');
    assert.strictEqual(result.status, 0, result.stderr);
    assert.strictEqual(result.stderr, '');

    const snapshotPath = path.join(__dirname, 'snapshots', 'log.stdout.json');
    const actual = result.stdout.split('\n');

    if (process.env.UPDATE_SNAPSHOTS === '1' && entryPoint === 'index.js') {
        writeFileSync(snapshotPath, JSON.stringify(actual, null, 2) + '\n');
    }

    const expected = JSON.parse(readFileSync(snapshotPath, 'utf8'));
    assert.deepStrictEqual(actual, expected);
}

describe('bunya CLI', function () {
    it('index.js matches the stdout snapshot for log.json', function () {
        assertSnapshot('index.js');
    });

    it('bin/bunya matches the stdout snapshot for log.json', function () {
        assertSnapshot('bin/bunya');
    });
});
