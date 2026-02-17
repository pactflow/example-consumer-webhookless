import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import "spectre.css/dist/spectre.min.css";
import "spectre.css/dist/spectre-icons.min.css";
import "spectre.css/dist/spectre-exp.min.css";
import API from "./api.ts";
import Heading from "./Heading.tsx";
import Layout from "./Layout.tsx";
import type { Product } from "./types/index.ts";

interface ProductTableRowProps {
  product: Product;
}

function ProductTableRow(props: ProductTableRowProps) {
  return (
    <tr>
      <td>{props.product.name}</td>
      <td>{props.product.type}</td>
      <td>
        <Link
          className="btn btn-link"
          to={{
            pathname: `/products/${props.product.id}`,
          }}
        >
          See more!
        </Link>
      </td>
    </tr>
  );
}

interface ProductTableProps {
  products: Product[];
}

function ProductTable(props: ProductTableProps) {
  const products = props.products.map((p) => (
    <ProductTableRow key={p.id} product={p} />
  ));
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th />
        </tr>
      </thead>
      <tbody>{products}</tbody>
    </table>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const inputId = useId();

  useEffect(() => {
    API.getAllProducts()
      .then((r) => {
        setLoading(false);
        setProducts(r);
        setVisibleProducts(r);
      })
      .catch((_e) => {
        // Silently fail - error handling would be added in production
      });
  }, []);

  useEffect(() => {
    const findProducts = (search: string) => {
      const lowerSearch = search.toLowerCase();
      return products.filter(
        (p) =>
          p.id.toLowerCase().includes(lowerSearch) ||
          p.name.toLowerCase().includes(lowerSearch) ||
          p.type.toLowerCase().includes(lowerSearch),
      );
    };

    setVisibleProducts(searchText ? findProducts(searchText) : products);
  }, [searchText, products]);

  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <Layout>
      <Heading text="Products" href="/" />
      <div className="form-group col-2">
        <label className="form-label" htmlFor={inputId}>
          Search
        </label>
        <input
          id={inputId}
          className="form-input"
          type="text"
          value={searchText}
          onChange={onSearchTextChange}
        />
      </div>
      {loading ? (
        <div className="loading loading-lg centered" />
      ) : (
        <ProductTable products={visibleProducts} />
      )}
    </Layout>
  );
}

export default App;
