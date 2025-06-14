# mss-frontend
React web frontend monorepo

The project uses Vite and Redux.

# Give it a try!

You can try this webapp in AWS **until approximately 2026.06.01**, or until AWS starts charging for hosting—whichever comes first.

http://mss-webhosting-bucket.s3-website.eu-north-1.amazonaws.com/

## Required pnpm version

For the build I am using pnpm.

8.15.5

# Build

## CI build

The build is triggered on every push to the `main` branch.  
It builds the web app and deploys it to the configured AWS S3 bucket.

## First steps to build on localhost

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
This runs the build script defined in [apps/web/package.json](apps/web/package.json), which uses Vite.

### Local web development

Please install the Vite plugin to your VS Code (optional).

Run your application locally with:

```
pnpm --filter @mss-frontend/web dev
```

The webapp will be available at http://localhost:5173