# Security maintenance — 2026-10-24

Expo was patched within SDK 54 to 54.0.38; expo-linking now follows the SDK's
8.0.12 recommendation. React 19.1.0 and React Native 0.81.5 are unchanged.
The expo-router override references the direct dependency to prevent npm from
auto-installing an unrelated SDK 58 peer version.

Scoped overrides intentionally exceed parent ranges:

| Parent | Original range | Selected | Compatibility evidence |
|---|---|---|---|
| @expo/metro-config → postcss | ~8.4.32 | 8.5.31 | Parse and plugin transform |
| metro → image-size | ^1.0.2 | 2.0.4 | Real Metro PNG dimensions, empty input rejection, non-image path |

Validation: frozen npm install with scripts disabled, TypeScript, Expo install
check and all 3 dependency tests passed. npm audit decreased from 27 affected
packages (2 critical) to 7 (4 high, 3 moderate, 0 critical). npm ls reports missing
react-dom peers through router web dependencies; react-dom was absent in the
original lock too. It is not silently treated as a successful full-tree gate.
No new web platform dependency was introduced to hide this finding.

## Remaining upstream issues

- node-forge 1.4.0: [GHSA-86w9-cpqp-85rv](https://github.com/digitalbazaar/forge/issues/1149),
  high, no published fix at review time. The installed path is Expo CLI/code signing;
  application code does not directly import it. Malicious signatures/certificates
  reaching the affected RSA verifier are the relevant condition. No custom crypto patch.
- decode-uri-component 0.2.2: [GHSA-vcc3-ghjq-m6fr](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr),
  moderate malformed-input CPU denial of service. Fixed 0.5.x is ESM and cannot
  replace the callable CommonJS API expected by query-string 7.1.3. The inspected
  Expo Router call sites use stringify, not the affected parse decoder. This narrows
  observed exposure but is not proof of universal non-reachability. Keep the finding
  open until a compatible upstream fix or separately reviewed router migration.

Audit counts include parent packages affected transitively, not seven distinct
advisories. Do not use forced audit fixes that downgrade Expo. Recheck both advisories
before release. Native/dev-client behavior and deep links require human review;
no EAS build, server, deployment, commit or push was performed.
