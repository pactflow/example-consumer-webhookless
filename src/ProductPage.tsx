import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "spectre.css/dist/spectre.min.css";
import "spectre.css/dist/spectre-icons.min.css";
import "spectre.css/dist/spectre-exp.min.css";
import API from "./api.ts";
import Heading from "./Heading.tsx";
import Layout from "./Layout.tsx";
import type { Product } from "./types/index.ts";

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Partial<Product>>({ id });
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      API.getProduct(id)
        .then((r) => {
          setLoading(false);
          setProduct(r);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [id]);

  if (error) {
    throw new Error("unable to fetch product data");
  }

  const productInfo = (
    <div>
      <p>ID: {product.id}</p>
      <p>Name: {product.name}</p>
      <p>Type: {product.type}</p>
    </div>
  );

  return (
    <Layout>
      <Heading text="Products" href="/" />
      {loading ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="loading loading-lg"
        />
      ) : (
        productInfo
      )}
    </Layout>
  );
}

export default ProductPage;
