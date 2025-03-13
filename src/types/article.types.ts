export interface Article {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  categories: string[];
}

export interface ArticleProcessingJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  articles: Article[];
  error?: string;
}
