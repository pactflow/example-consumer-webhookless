import axios, { type AxiosRequestConfig } from "axios";
import type { Product } from "./types/index.ts";

export class Api {
  private readonly baseUrl: string;

  constructor(url?: string) {
    this.baseUrl = url || import.meta.env.VITE_API_BASE_URL || "";
  }

  generateAuthToken(): string {
    return `Bearer ${new Date().toISOString()}`;
  }

  private requestConfig(): AxiosRequestConfig {
    return {
      // biome-ignore lint/style/useNamingConvention: `baseURL` is axios's option name, not a project identifier
      baseURL: this.baseUrl,
      headers: {
        // biome-ignore lint/style/useNamingConvention: HTTP header name follows RFC 7235 casing
        Authorization: this.generateAuthToken(),
      },
    };
  }

  getAllProducts(): Promise<Product[]> {
    return axios
      .get<Product[]>("/products", this.requestConfig())
      .then((r) => r.data);
  }

  getProduct(id: string): Promise<Product> {
    return axios
      .get<Product>(`/product/${id}`, this.requestConfig())
      .then((r) => r.data);
  }
}

export const api = new Api(import.meta.env.VITE_API_BASE_URL);
