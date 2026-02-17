import axios from 'axios';
import type { Product } from './types';

export class API {
  url: string;

  constructor(url?: string) {
    if (url === undefined || url === "") {
      url = process.env.REACT_APP_API_BASE_URL;
    }
    if (url && url.endsWith("/")) {
      url = url.substr(0, url.length - 1);
    }
    this.url = url || "";
  }

  withPath(path: string): string {
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    return `${this.url}${path}`;
  }

  generateAuthToken(): string {
    return "Bearer " + new Date().toISOString();
  }

  async getAllProducts(): Promise<Product[]> {
    return axios.get<Product[]>(this.withPath("/products"), {
      headers: {
        "Authorization": this.generateAuthToken()
      }
    })
    .then(r => r.data);
  }

  async getProduct(id: string): Promise<Product> {
    return axios.get<Product>(this.withPath("/product/" + id), {
      headers: {
        "Authorization": this.generateAuthToken()
      }
    })
    .then(r => r.data);
  }
}

export default new API(process.env.REACT_APP_API_BASE_URL);
