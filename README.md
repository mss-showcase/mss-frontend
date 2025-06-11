# mss-frontend
React Native (web+android) frontend monorepo with Expo

The project is using Vite and Redux.

## Required pnpm version

For the build I am using pnpm.

8.15.5

# build

## CI build

The build is conditionally here to save some resources at EXPO server.

 * in case of apps/mobile -> only the android build runs
 * in case of apps/web -> only the web build runs
 * in case of packages/ and key files (./*.json and ./*.yml and ./*.yaml) -> both build run

## First steps to be able to build on localhost

Basically, you should follow the build.yml tasks (if this would not be up-to-date).
Install node locally.

```
npm install -g pnpm@8.15.5
pnpm install
```

## Web App

From the monorepo root, run:

```
pnpm --filter @mss-frontend/web build
```
This runs the build script defined in [apps/web/package.json]package.json ), which uses Vite.

### local web development

Please install Vite plugin to your VS Code.

Run your application locally with 

```
pnpm --filter @mss-frontend/web dev
```

the webapp will be available at http://localhost:5173

## local mobile app development (Expo/React Native)

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

Or, for EAS Build, you can use the

```
# you must go to the mobile app folder first!
cd apps/mobile
eas build --platform android
```
command, but you must pay attention of the current work directory!

# Expo Application Services (EAS) CLI setup on windows

What is EAS? : Expo Application Services: A build and submission service for mobile app developers that handles cloud-based app building and deployment. 

For local development, I would recomment the Expo.

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