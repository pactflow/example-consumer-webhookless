# Example Consumer with webhookless deployment pipeline

![Build](https://github.com/pactflow/example-consumer-webhookless/workflows/Build/badge.svg)

[![Pact Status](https://testdemo.pactflow.io/pacts/provider/pactflow-example-provider/consumer/pactflow-example-consumer-webhookless/latest/badge.svg?label=provider)](https://testdemo.pactflow.io/pacts/provider/pactflow-example-provider/consumer/pactflow-example-consumer-webhookless/latest) (latest pact)

[![Pact Status](https://testdemo.pactflow.io/matrix/provider/pactflow-example-provider/latest/master/consumer/pactflow-example-consumer-webhookless/latest/master/badge.svg)](https://testdemo.pactflow.io/pacts/provider/pactflow-example-provider/consumer/pactflow-example-consumer-webhookless/latest/master) (master/master pact)

## Prerequisites

- **Node.js+**: This project requires a recent Node.js version
- **npm**: Included with Node.js

## Technology Stack

- **Build Tool**: [Vite](https://vite.dev/) - Fast development server with HMR
- **Test Framework**: [Vitest](https://vitest.dev/) - Vite-native testing framework
- **Linting & Formatting**: [Biome](https://biomejs.dev/) - Unified toolchain for code quality
- **Type Safety**: TypeScript with strict mode enabled
- **React**: Function components with React Router

This is an example of how to set up a deployment pipeline for a consumer that does not make use of PactFlow/Pact Broker webhooks. This flow is a good alternative where the use of webhooks is not possible due to firewalls.

Webhooks are typically used to ensure that a recently change pact gets verified by the provider immediately, rather than waiting for a provider build to run. This workflow ensures changed pacts are verified immediately by checking out the provider codebase in the consumer's pipeline, and running the verification as part of the consumer's own tests.

The downside of this flow is that it requires the consumer to have access to the provider code, and understand how to execute the tests.

## Workflow

The deployment pipeline runs in Github Actions, and is defined in the [build.yml](.github/workflows/build.yml) file.

The Test, Can-I-Deploy and Deploy steps are identical to the flow that uses webhooks. The Verify step is the extra part that usually runs out of bound in the provider's CI environment.

- Test
  - Run tests
  - Publish pacts
- Verify (set to continue workflow on error)
  - Check if a verification from the master version of the provider already exists using can-i-deploy, raise error if it *does exist* so we do not continue with the rest of the steps
  - Checkout provider
  - Verify pacts
  - Publish verification results
- Can-I-Deploy
  - Check if the current version of the consumer is compatible with the *production* version of the provider.
- Deploy
  - Deploy application
  - Tag the deployed version in PactFlow as 'prod'

## Local Development

This consumer requires a running provider service for local development.

### Quick Start

**In terminal 1** - Start the provider:

```bash
git clone https://github.com/pactflow/example-provider
cd example-provider
npm install
npm run dev
```

**In terminal 2** - Start this consumer:

```bash
npm install
npm run dev
```

The consumer runs at <http://localhost:3000> and connects to the provider at <http://localhost:8080> by default.

The dev server will automatically check if the provider is available and show helpful instructions if it's not running.

### Environment Variables

Copy `.env.local.example` to `.env.local` to customize the provider URL:

```bash
cp .env.local.example .env.local
```

The default provider URL is `http://localhost:8080`. Modify `VITE_API_BASE_URL` in `.env.local` if your provider runs on a different port.

### Available Scripts

- `npm run dev` - Start the Vite development server with hot module replacement
- `npm test` - Run all tests with Vitest
- `npm run test:pact` - Run only Pact contract tests
- `npm run type-check` - Check TypeScript types without emitting files
- `npm run check` - Run all Biome checks (linting + formatting)
- `npm run check:fix` - Automatically fix Biome issues (use with caution)

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Configuration is in `biome.jsonc`.

The CI pipeline runs:

1. Type checking (`npm run type-check`)
2. Code quality checks (`npm run check`)
3. Build validation (`npm run build`)
4. Tests (`npm test`)
