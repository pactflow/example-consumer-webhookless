# Example Consumer with webhookless deployment pipeline

![Build](https://github.com/pactflow/example-consumer-webhookless/workflows/Build/badge.svg)

[![Pact Status](https://testdemo.pactflow.io/pacts/provider/pactflow-example-provider/consumer/pactflow-example-consumer-webhookless/latest/badge.svg?label=provider)](https://testdemo.pactflow.io/pacts/provider/pactflow-example-provider/consumer/pactflow-example-consumer-webhookless/latest) (latest pact)

[![Pact Status](https://testdemo.pactflow.io/matrix/provider/pactflow-example-provider/latest/master/consumer/pactflow-example-consumer-webhookless/latest/master/badge.svg)](https://testdemo.pactflow.io/pacts/provider/pactflow-example-provider/consumer/pactflow-example-consumer-webhookless/latest/master) (master/master pact)

This is an example of how to set up a deployment pipeline for a consumer that does not make use of PactFlow/Pact Broker webhooks. This flow is a good alternative where the use of webhooks is not possible due to firewalls.

Webhooks are typically used to ensure that a recently change pact gets verified by the provider immediately, rather than waiting for a provider build to run. This workflow ensures changed pacts are verified immediately by checking out the provider codebase in the consumer's pipeline, and running the verification as part of the consumer's own tests.

The downside of this flow is that it requires the consumer to have access to the provider code, and understand how to execute the tests.

## Workflow

The deployment pipeline runs in Github Actions, and is defined in the [build.yml](.github/workflows/build.yml) file.

The Test, Can-I-Deploy and Deploy steps are identical to the flow that uses webhooks. The Verify step is the extra part that usually runs out of bound in the provider's CI environment.

* Test
  * Run tests
  * Publish pacts
* Verify (set to continue workflow on error)
  * Check if a verification from the master version of the provider already exists using can-i-deploy, raise error if it *does exist* so we do not continue with the rest of the steps
  * Checkout provider
  * Verify pacts
  * Publish verification results
* Can-I-Deploy
  * Check if the current version of the consumer is compatible with the *production* version of the provider.
* Deploy
  * Deploy application
  * Tag the deployed version in PactFlow as 'prod'

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

The consumer runs at <http://localhost:3000> and connects to the provider at <http://localhost:8080>.

The dev server will automatically check if the provider is available and show helpful instructions if it's not running.
