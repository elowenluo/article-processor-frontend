import { Article } from "./article.types";

export type ApiProvider = "openai" | "google" | "claude" | "grok" | "";
export type ApiType = "standard" | "custom";

export interface ApiConfig {
  type: ApiType;
  provider: ApiProvider;
  model: string;
  apiKey: string;
  customUrl?: string;
}

export interface ProcessArticlesRequest {
  urls: string[];
  apiConfig: ApiConfig;
}

export interface ProcessArticlesResponse {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  message: string;
}

export interface ProcessArticlesStatusResponse {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  urls: string[];
  results?: Article[];
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}
