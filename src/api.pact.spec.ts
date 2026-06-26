// biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: test suites group many related cases in one describe block
import { MatchersV3, PactV3 } from "@pact-foundation/pact";
import { Api } from "./api.ts";

const { eachLike, like } = MatchersV3;
const Pact = PactV3;

const mockProvider = new Pact({
  consumer: "pactflow-example-consumer-webhookless",
  provider: import.meta.env.PACT_PROVIDER || "pactflow-example-provider",
});

describe("API Pact test", () => {
  describe("retrieving a product", () => {
    test("ID 10 exists", () => {
      // Arrange
      const expectedProduct = {
        id: "10",
        type: "CREDIT_CARD",
        name: "28 Degrees",
      };

      // Uncomment to see this fail
      // const expectedProduct = { id: '10', type: 'CREDIT_CARD', name: '28 Degrees', price: 30.0, newField: 22}

      mockProvider
        .given("a product with ID 10 exists")
        .uponReceiving("a request to get a product")
        .withRequest({
          method: "GET",
          path: "/product/10",
          headers: {
            // biome-ignore lint/style/useNamingConvention: HTTP header name follows RFC 7235 casing
            Authorization: like("Bearer 2019-01-14T11:34:18.045Z"),
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: like(expectedProduct),
        });
      return mockProvider.executeTest(async (mockserver) => {
        // Act
        const api = new Api(mockserver.url);
        const product = await api.getProduct("10");

        // Assert - did we get the expected response
        expect(product).toStrictEqual(expectedProduct);
      });
    });

    test("product does not exist", () => {
      // set up Pact interactions

      mockProvider
        .given("a product with ID 11 does not exist")
        .uponReceiving("a request to get a product")
        .withRequest({
          method: "GET",
          path: "/product/11",
          headers: {
            // biome-ignore lint/style/useNamingConvention: HTTP header name follows RFC 7235 casing
            Authorization: like("Bearer 2019-01-14T11:34:18.045Z"),
          },
        })
        .willRespondWith({
          status: 404,
        });
      return mockProvider.executeTest(async (mockserver) => {
        const api = new Api(mockserver.url);

        // make request to Pact mock server
        await expect(api.getProduct("11")).rejects.toThrow(
          "Request failed with status code 404",
        );
      });
    });
  });
  describe("retrieving products", () => {
    test("products exists", () => {
      // set up Pact interactions
      const expectedProduct = {
        id: "10",
        type: "CREDIT_CARD",
        name: "28 Degrees",
      };

      mockProvider
        .given("products exist")
        .uponReceiving("a request to get all products")
        .withRequest({
          method: "GET",
          path: "/products",
          headers: {
            // biome-ignore lint/style/useNamingConvention: HTTP header name follows RFC 7235 casing
            Authorization: like("Bearer 2019-01-14T11:34:18.045Z"),
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: eachLike(expectedProduct),
        });
      return mockProvider.executeTest(async (mockserver) => {
        const api = new Api(mockserver.url);

        // make request to Pact mock server
        const products = await api.getAllProducts();

        // assert that we got the expected response
        expect(products).toStrictEqual([expectedProduct]);
      });
    });
  });
});
