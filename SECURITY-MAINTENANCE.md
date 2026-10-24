# Security maintenance — 2026-10-24

Expo was patched within SDK 54 to 54.0.38; expo-linking now follows the SDK's
8.0.12 recommendation. React 19.1.0 and React Native 0.81.5 are unchanged.
The expo-router override references the direct dependency to prevent npm from
auto-installing an unrelated SDK 58 peer version.

Scoped overrides intentionally exceed parent ranges:

| Parent | Original range | Selected | Compatibility evidence |
|---|---|---|---|
| @expo/metro-config → postcss | ~8.4.32 | 8.5.31 | Parse and plugin transform |
| @expo/metro → Metro family (14 packages) | 0.83.3 | 0.83.8 | Buffer and real disk/density image regression; full iOS export required |

Initial validation: frozen npm install with scripts disabled, TypeScript, Expo install
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
before release. Native/dev-client behavior and deep links require human review.

## Build compatibility correction

The first authorized EAS build (1.2.0 build 9) failed while bundling unmatched.png.
The image-size 2.0.4 override passed a buffer test but did not support Metro's
filename API. A real on-disk PNG/density regression reproduces that failure.
The override has been replaced by the aligned official Metro 0.83.8 family, which
[removes image-size](https://github.com/react/metro/releases/tag/v0.83.8).
This includes Metro's required parser/ob1 transitive updates. No local patch or
postinstall modification is used. Remove these overrides when Expo adopts the fix.

expo-constants ~18.0.14 is now declared directly as required by Expo Router;
the resolved version was already 18.0.14. This declaration was explicitly approved.
The failed build must not be submitted. Retry only after normal frozen install,
4 dependency tests, tsc, Expo checks and a full local iOS export succeed.

Correction validation: frozen npm ci and npm rebuild succeeded; all 4 dependency
tests, tsc, Expo install check and full iOS export (including unmatched.png) passed.
All 14 Metro packages resolve to 0.83.8; image-size is absent. Audit remains 4H/3M.
Local expo-doctor reports an additional React 19.2.0 in an ancestor directory outside
this checkout, alongside the correct local React 19.1.0. That external installation
was not modified and is not uploaded to EAS; verify cloud doctor on the retry.

## Release result

The corrected cloud build passed all 18 Expo doctor checks and completed as
1.2.0 (10), commit ef610e0, build ID 105ced92-a6c6-4e72-95ad-4567f13e61bf.
TestFlight submission 3fc89a21-a598-4505-82f3-a9693b9918fc uploaded to App Store
Connect, but Apple subsequently rejected it with ITMS-90186 / ITMS-90062 because
1.2.0 was already approved and its release train was closed. Upload success was
not Apple acceptance. Marketing version is increased to 1.2.1 for a new build.
No public App Store release was requested or performed.

For subsequent releases, check the latest approved version in App Store Connect
before building, and verify the resolved Expo marketing version is higher.
Increasing only the remote build number is insufficient for a closed release train.
Report EAS upload and Apple's processing/TestFlight availability separately.

Version-corrected release: 1.2.1 (11), commit 535bccf,
build a835fb04-807f-4b6f-a659-4e2ce1e11d42 completed successfully. Submission
df7df14b-651d-4b1c-bec8-b72791660765 uploaded to App Store Connect on 2026-10-24.
Apple processing completion and TestFlight device testing are not yet verified.
