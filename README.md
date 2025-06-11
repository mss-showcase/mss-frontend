# mss-frontend
React Native (web+android) frontend monorepo with Expo

The project is using Vite and Redux.

## Required pnpm version

For the build I am using pnpm.

8.15.5

# build

## Web App

From the monorepo root, run:

```
pnpm --filter @mss-frontend/web build
```
This runs the build script defined in [apps/web/package.json]package.json ), which uses Vite.

## Mobile App (Expo/React Native)

Expo/React Native projects typically do not have a "build" script for production like web apps.
Instead, you use Expo CLI to bundle or build the app for distribution.

To start the Expo bundler (development), from the monorepo root, run:

```
npm --filter @mss-frontend/mobile start
```

To build a production binary (requires Expo account), from the monorepo root, run:

```
pnpm --filter @mss-frontend/mobile exec expo build:android
pnpm --filter @mss-frontend/mobile exec expo build:ios
```

Or, for EAS Build (recommended for new Expo projects), from the monorepo root, run:
```
pnpm --filter @mss-frontend/mobile exec eas build --platform android
pnpm --filter @mss-frontend/mobile exec eas build --platform ios
```

# Expo Application Services (EAS) CLI setup on windows

What is EAS? : Expo Application Services: A build and submission service for mobile app developers that handles cloud-based app building and deployment. 

## How to install

```
npm install -g eas-cli
```

## Expo login

```
eas login
```

if you don't have a login, sign up here https://expo.dev/signup

## Eas build 

see above
In the end of the build, you will get a link:
Build successful! Download: https://expo.dev/artifacts/abc123/app-release.apk

## EAS TOKEN

You need to obtain a token for running the build:

```
eas whoami
eas token:create
```

That token should be set as github repo or org secret with this name: EXPO_TOKEN 

Github repo or org:

Settings > Secrets and variables > Actions