# AGENTS.md

NestJS Swagger decorator library (`@nanogiants/nestjs-swagger-api-exception-decorator`) — published to npm, single package.

## Commands

```bash
npm test                          # run all Jest tests
npm run test:update-snapshots     # jest -u  — update snapshot files (required after intentional output changes)
npm run lint                      # ESLint --fix on src/ only
npm run lint:all                  # lint src/ + demo/ (what CI runs)
npm run prepublishOnly            # clean + tsc -b tsconfig.build.json (library build)
npm run prepack                   # lint + prepublishOnly (runs before npm pack/publish)
```

**Note on `snip`**: The local `snip` wrapper (available in this shell) filters verbose npm output and prints `ok` on apparent success, saving full output to `~/.local/share/snip/tee/<timestamp>-npm.log`. However `snip` can return `ok` for commands that have real errors (observed with `npm run lint` masking ESLint failures after a major @typescript-eslint upgrade). After any major dependency upgrade, always verify lint with the raw binary — zero output = truly clean:

```bash
./node_modules/.bin/eslint -c .eslintrc.js --ext .ts src
```

`snip` "ok" alone is not sufficient evidence after version bumps.

## Source Layout

```
src/
  index.ts                  # re-exports everything from lib/
  lib/
    index.ts                # public API: ApiException, buildTemplatedApiExceptionDecorator, buildPlaceholder
    decorators/             # ApiException decorator implementation
    builder/                # buildTemplatedApiExceptionDecorator, buildPlaceholder
    utils/                  # internal helpers (example, schema, options, type, decorator utils)
      swagger-internals.util.ts  # mirrors @nestjs/swagger/dist internals (DECORATORS, SchemaObjectMetadata, getTypeIsArrayTuple, ModelPropertiesAccessor)
    interfaces/             # Options, MergedOptions, Placeholder, Template types
      open-api.interface.ts      # mirrors @nestjs/swagger/dist OpenAPI spec types (SchemaObject, ReferenceObject, ContentObject, …)
  test/                     # all test files (excluded from build)
    decorators/
      __snapshots__/
      issues/               # regression tests for specific GitHub issues
demo/                       # standalone NestJS app showing usage; own package.json + tsconfig
dist/                       # build output (gitignored); main + types both point to ./dist/index
```

## Testing Quirks

- **Jest rootDir is `./src`**, testRegex `.spec.ts$` — all test files live under `src/test/`
- Tests import from `../../lib` (relative), not from the npm package name
- **Snapshot tests are heavily used** — most tests use `toMatchSnapshot()`. After any intentional behaviour change, run `npm run test:update-snapshots` to regenerate snapshots, then commit the updated `__snapshots__/` files
- `@nestjs/swagger` is **mocked** in `api-exception.decorator.spec.ts` — `ApiResponse` is replaced with a `jest.fn()` that still calls the real implementation. Do not assume the real swagger decorator runs in tests
- `src/test/decorators/issues/` holds regression tests named by GitHub issue numbers (e.g. `26.spec.ts`, `33.spec.ts`) — add new ones for bug fixes

## Build

- **Library build**: `tsc -b tsconfig.build.json` (incremental=false, excludes all `*.spec.ts` and `src/test/`)
- `tsconfig.json` (dev) has `baseUrl: ./src` and `incremental: true`; `tsconfig.build.json` overrides `incremental: false` and excludes test files
- `demo/` has its own `tsconfig.json` and is **excluded** from all root tsconfig scopes
- **peerDependencies + devDependencies**: When moving a package from `dependencies` to `peerDependencies` (correct for a library), always **also add it to `devDependencies`**. Peer deps are not auto-installed for the root project by npm, so the dev/test environment loses the package. `rxjs` follows this pattern: `peerDependencies` declares the consumer contract; `devDependencies` ensures local tests and the build have it.

## Verification Checklist

Run all three gates in order before declaring any change complete:

1. `npm run lint` — ESLint must be clean (zero errors); verify with the raw binary after major upgrades (see Commands note on `snip`)
2. `npm test` — all 24 tests / 3 suites must pass
3. `npm run prepublishOnly` — library build (tsc) must be error-free

Never claim "done" after only lint + test. The build independently validates type resolution across the full source tree and catches errors tests can miss (e.g. missing module types from peerDependencies that jest resolves differently).

## Linting & Formatting

- Prettier config in `package.json`: `singleQuote`, `tabWidth: 2`, `printWidth: 120`, `trailingComma: 'all'`, `arrowParens: 'avoid'`
- ESLint enforces **import ordering**: external imports before internal, alphabetical, with a newline between groups
- `@typescript-eslint/no-explicit-any` is **off** — `any` is permitted
- Root `.eslintrc.js` ignores `demo/`; demo has its own separate `.eslintrc.js`

## Pre-commit Hook (Husky)

- Runs `prettier --write` on all staged files and re-stages them
- Does **not** run lint or tests on commit — those only run in CI

## CI Pipeline

`build.yml` (on push to `master`/`develop` and PRs):

1. `npm run lint:all`
2. `npm test -- --coverage` (coverage sent to SonarCloud)
3. SonarCloud scan

`npm_publish.yml` (on `v*` tags): lint → test → `npm publish --access public`

## @nestjs/swagger Compatibility Shim

Starting with `@nestjs/swagger@11.4.3` the package added an `exports` field to `package.json`, blocking all `/dist/**` deep imports. Two internal mirror files replace those imports:

- **`src/lib/interfaces/open-api.interface.ts`** — full OpenAPI spec types (`SchemaObject`, `ReferenceObject`, `ExampleObject`, `ExamplesObject`, `MediaTypeObject`, `ContentObject`, `OpenAPIFormat`, `DiscriminatorObject`, `XmlObject`, `ExternalDocumentationObject`). Sourced from `@nestjs/swagger/dist/interfaces/open-api-spec.interface`.
- **`src/lib/utils/swagger-internals.util.ts`** — `DECORATORS` constants, `SchemaObjectMetadata` union type, `getTypeIsArrayTuple` helper, and `ModelPropertiesAccessor` class. Sourced from `@nestjs/swagger/dist/constants`, `…/interfaces/schema-object-metadata.interface`, `…/decorators/helpers`, and `…/services/model-properties-accessor`.

**Rules for maintaining these files:**

- Keep type shapes in sync with upstream when upgrading `@nestjs/swagger`
- `@typescript-eslint/ban-types` bans `Function` and `{}` — use `type AnyCallable = (...args: any[]) => any` instead of `Function`
- Do not use `(string & {})` patterns — use plain `string` as the open-ended tail of string literal unions

## Publishing

- Triggers on git tags matching `v*`
- `prepublishOnly` runs automatically: `rimraf dist` then `tsc -b tsconfig.build.json`
- Published as public scoped package to both npmjs.org and GitHub Packages
