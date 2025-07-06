# mss-frontend
React web frontend monorepo

The project uses Vite and Redux.

# Give it a try!

You can try this webapp in AWS **until approximately 2026.06.01**, or until AWS starts charging for hosting—whichever comes first.

S3 static web bucket hosting (normal auth only):

http://mss-webhosting-bucket.s3.eu-north-1.amazonaws.com/index.html


Cloudfront (normal + google auth): 

https://dgjqblpal7nk2.cloudfront.net/index.html


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

## Configuration: config.json

Before running or deploying the frontend, you must define the following public IDs in `apps/web/public/config.json`:

```
{
  "LOCAL_GATEWAY_URL": "<your-backend-url>",
  "COGNITO_USER_POOL_ID": "<your-cognito-user-pool-id>",
  "COGNITO_CLIENT_ID": "<your-cognito-app-client-id>",
  "GOOGLE_CLIENT_ID": "<your-google-oauth-client-id>"
}
```

**Note:** Do NOT put any secrets or private keys in this file. Only public IDs are safe to expose in the frontend.