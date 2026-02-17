import React from 'react';
import {Link} from 'react-router-dom';
import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.min.css';
import 'spectre.css/dist/spectre-exp.min.css';
import Heading from "./Heading";
import Layout from "./Layout";
import API from "./api";
import type { Product } from './types';

interface ProductTableRowProps {
  product: Product;
}

function ProductTableRow(props: ProductTableRowProps) {
  return (
    <tr>
      <td>{props.product.name}</td>
      <td>{props.product.type}</td>
      <td>
        <Link className="btn btn-link" to={{
          pathname: "/products/" + props.product.id,
        }}>See more!</Link>
      </td>
    </tr>
  );
}

interface ProductTableProps {
  products: Product[];
}

function ProductTable(props: ProductTableProps) {
  const products = props.products.map(p => (
    <ProductTableRow key={p.id} product={p}/>
  ));
  return (
    <table className="table table-striped table-hover">
      <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th/>
      </tr>
      </thead>
      <tbody>
      {products}
      </tbody>
    </table>
  );
}

interface AppState {
  loading: boolean;
  searchText: string;
  products: Product[];
  visibleProducts: Product[];
}

class App extends React.Component<object, AppState> {
  constructor(props: object) {
    super(props);

    this.state = {
      loading: true,
      searchText: '',
      products: [],
      visibleProducts: []
    };
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
  }

  componentDidMount() {
    API.getAllProducts()
      .then(r => {
        this.setState({
          loading: false,
          products: r
        });
        this.determineVisibleProducts();
      })
      .catch(e => {
        console.error('Failed to fetch products:', e);
      });
  }

  determineVisibleProducts() {
    const findProducts = (search: string) => {
      search = search.toLowerCase();
      return this.state.products.filter(p =>
        p.id.toLowerCase().includes(search)
        || p.name.toLowerCase().includes(search)
        || p.type.toLowerCase().includes(search)
      )
    };
    this.setState((s) => {
      return {
        visibleProducts: s.searchText ? findProducts(s.searchText) : s.products
      }
    });
  }

  onSearchTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      searchText: e.target.value
    });
    this.determineVisibleProducts()
  }

  render() {
    return (
      <Layout>
        <Heading text="Products" href="/"/>
        <div className="form-group col-2">
          <label className="form-label" htmlFor="input-product-search">Search</label>
          <input id="input-product-search" className="form-input" type="text"
               value={this.state.searchText} onChange={this.onSearchTextChange}/>
        </div>
        {
          this.state.loading ?
            <div className="loading loading-lg centered"/> :
            <ProductTable products={this.state.visibleProducts}/>
        }
      </Layout>
    );
  }
}

export default App;
