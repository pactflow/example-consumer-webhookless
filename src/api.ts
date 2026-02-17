import axios from "axios";
import type { Product } from "./types/index.ts";

export class API {
  private readonly baseURL: string;

  constructor(url?: string) {
    this.baseURL = url || import.meta.env.VITE_API_BASE_URL || "";
  }

  generateAuthToken(): string {
    return `Bearer ${new Date().toISOString()}`;
  }

  getAllProducts(): Promise<Product[]> {
    return axios
      .get<Product[]>("/products", {
        baseURL: this.baseURL,
        headers: {
          Authorization: this.generateAuthToken(),
        },
      })
      .then((r) => r.data);
  }

  getProduct(id: string): Promise<Product> {
    return axios
      .get<Product>(`/product/${id}`, {
        baseURL: this.baseURL,
        headers: {
          Authorization: this.generateAuthToken(),
        },
      })
      .then((r) => r.data);
  }
}

export default new API(import.meta.env.VITE_API_BASE_URL);
