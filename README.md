#  Bunya
Lightweight CLI tool for nicely viewing JSON logs

![image](https://raw.githubusercontent.com/petrgrishin/bunya/master/screen.png)

## Usage

```sh
cat test/snapshots/log.json | npx bunya
```

`bin/bunya` runs `index.js` directly; no build step is required.

## Development

Install Node.js 26, 24, and 22 with [mise](https://mise.jdx.dev/), then install dependencies and run the tests on all three versions:

```sh
mise install
mise exec -- npm ci
mise run test
```

To test a single version:

```sh
mise exec node@22 -- npm test
```

The CLI snapshot tests feed `test/snapshots/log.json` to both `index.js` and `bin/bunya`
and compare their stdout with
the same `test/snapshots/log.stdout.json`. They fix the timezone to
`Europe/Moscow` and disable colors. The snapshot stores one output line per
JSON array entry, preserving spaces and the final newline.

After an intentional output change, regenerate the snapshot with Node.js 24
and review the diff:

```sh
UPDATE_SNAPSHOTS=1 mise exec node@24 -- npm test
```

Only `index.js` updates the snapshot; `bin/bunya` must match that output.
