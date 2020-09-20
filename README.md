# Example Consumer with webhookless deployment pipeline

This is an example of how to set up a deployment pipeline for a consumer that does not make use of Pactflow/Pact Broker webhooks. This flow is a good alternative where the use of webhooks is not possible due to firewalls.

Webhooks are typically used to ensure that a recently change pact gets verified by the provider immediately, rather than waiting for a provider build to run. This workflow ensures changed pacts are verified immediately by checking out the provider codebase in the consumer's pipeline, and running the verification as part of the consumer's own tests.

The downside of this flow is that it requires the consumer to have access to the provider code, and understand how to execute the tests.

## Workflow

The deployment pipeline runs in Github Actions, and is defined in the [build.yml](.github/workflows/build.yml) file.

The Test, Can-I-Deploy and Deploy steps are identical to the flow that uses webhooks. The Verify step is the extra part that usually runs out of bound in the provider's CI environment.

* Test
    * Run tests
    * Publish pacts
* Verify (set to continue workflow on error)
    * Check if a verification from the master version of the provider already exists, raise error if it *does* so we do not continue with the rest of the steps
    * Checkout provider
    * Verify pacts
    * Publish verification results
* Can-I-Deploy
    * Check if the current version of the consumer is compatible with the *production* version of the provider.
* Deploy
    * Deploy application
    * Tag the deployed version in Pactflow as 'prod'
