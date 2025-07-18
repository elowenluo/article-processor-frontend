"use client";

import { useState, useCallback } from "react";
import { ApiConfig, Article } from "../types";
import {
  processArticles,
  getJobResults,
} from "../services/articleProcessingService";

interface ArticleProcessingState {
  articles: Article[];
  isProcessing: boolean;
  error: string | null;
  jobId: string | null;
}

/**
 * Custom hook for managing article processing state
 *
 * @returns {Object} Article processing state and handlers
 */
export const useArticleProcessing = () => {
  const [state, setState] = useState<ArticleProcessingState>({
    articles: [],
    isProcessing: false,
    error: null,
    jobId: null,
  });

  // Poll for job results - moved to the top to avoid initialization error
  const pollJobResults = useCallback(async (jobId: string) => {
    try {
      const response = await getJobResults(jobId);

      if (response.status === "completed") {
        setState((prev) => ({
          ...prev,
          articles: response.results || [],
          isProcessing: false,
        }));
      } else if (response.status === "failed") {
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: response.error || "An error occurred during processing",
        }));
      } else {
        // Continue polling
        setTimeout(() => pollJobResults(jobId), 1000);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }, []);

  // Process articles with selected API
  const processArticlesHandler = useCallback(
    async (urls: string[], apiConfig: ApiConfig) => {
      try {
        setState((prev) => ({ ...prev, isProcessing: true, error: null }));

        const response = await processArticles(urls, apiConfig);

        setState((prev) => ({
          ...prev,
          jobId: response.jobId ?? null,
        }));

        // Poll for results
        if (response.jobId) {
          pollJobResults(response.jobId);
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        }));
      }
    },
    [pollJobResults]
  );

  // Load results for a specific job ID
  const loadResults = useCallback(async (jobId: string) => {
    try {
      setState((prev) => ({ ...prev, isProcessing: true, error: null, jobId }));

      // Poll for results
      pollJobResults(jobId);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }, [pollJobResults]);

  // Update an article
  const updateArticle = useCallback(
    (index: number, updatedArticle: Article) => {
      setState((prev) => {
        const updatedArticles = [...prev.articles];
        updatedArticles[index] = updatedArticle;
        return { ...prev, articles: updatedArticles };
      });
    },
    []
  );

  // Delete an article
  const deleteArticle = useCallback((index: number) => {
    setState((prev) => {
      const updatedArticles = prev.articles.filter((_, i) => i !== index);
      return { ...prev, articles: updatedArticles };
    });
  }, []);

  // Copy all articles to clipboard
  const copyAllArticles = useCallback(() => {
    if (state.articles.length === 0) return;

    try {
      const articlesText = JSON.stringify(
        state.articles.map((article) => {
          return {
            ...article,
            tags: article.tags.join("、"),
          };
        }),
        null,
        2
      );

      navigator.clipboard.writeText(articlesText);
      alert("All results copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy articles to clipboard:", error);
    }
  }, [state.articles]);

  // Process JSON data directly
  const processJsonData = useCallback((jsonData: string) => {
    try {
      setState((prev) => ({ ...prev, isProcessing: true, error: null }));
      
      const parsedData = JSON.parse(jsonData);
      
      // Validate JSON structure
      if (!parsedData.status || !parsedData.results || !Array.isArray(parsedData.results)) {
        throw new Error("Invalid JSON format. Expected format: { status: 'completed', jobId: 'string', results: [...] }");
      }
      
      // Validate articles structure
      const validatedArticles = parsedData.results.map((article: unknown, index: number) => {
        if (typeof article !== 'object' || article === null) {
          throw new Error(`Article ${index + 1} is not a valid object`);
        }
        
        const articleObj = article as Record<string, unknown>;
        
        if (!articleObj.title || !articleObj.content) {
          throw new Error(`Article ${index + 1} is missing required fields (title, content)`);
        }
        
        return {
          title: String(articleObj.title),
          content: String(articleObj.content),
          summary: String(articleObj.summary || ""),
          tags: Array.isArray(articleObj.tags) ? articleObj.tags.map(String) : [],
          categories: Array.isArray(articleObj.categories) ? articleObj.categories.map(String) : [],
        };
      });
      
      setState((prev) => ({
        ...prev,
        articles: validatedArticles,
        isProcessing: false,
        jobId: parsedData.jobId || "json-import",
      }));
      
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : "Failed to parse JSON data",
      }));
    }
  }, []);

  return {
    ...state,
    processArticles: processArticlesHandler,
    processJsonData,
    loadResults,
    updateArticle,
    deleteArticle,
    copyAllArticles,
  };
};
