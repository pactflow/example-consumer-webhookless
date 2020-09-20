# Example Consumer

This is an example of how to set up a deployment pipeline for a consumer that does not make use of Pactflow/Pact Broker webhooks. This flow is a good alternative where the use of webhooks is not possible due to firewalls.

Webhooks are typically used to ensure that a recently change pact gets verified by the provider immediately, rather than waiting for a provider build to run. This workflow ensures changed pacts are verified immediately by checking out the provider codebase in the consumer's pipeline, and running the verification as part of the consumer's own tests.

The downside of this flow is that it requires the consumer to have access to the provider code, and understand how to execute the tests.
