import {
  ApiConfig,
  ProcessArticlesResponse,
  ProcessArticlesStatusResponse
} from "../types";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000";

/**
 * Process articles using selected API
 *
 * @param {string[]} urls - List of article URLs to process
 * @param {ApiConfig} apiConfig - API configuration
 * @returns {Promise<ProcessArticlesResponse>} - Job information
 */
export const processArticles = async (
  urls: string[],
  apiConfig: ApiConfig
): Promise<ProcessArticlesResponse> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls,
        llmApiConfig: {
          url: apiConfig.customUrl || "",
          model: apiConfig.model,
          apiKey: apiConfig.apiKey,
        },
      }),
    });

    const data = (await response.json()) as ProcessArticlesResponse;

    return data;
  } catch (error) {
    console.error("Error processing articles:", error);
    throw new Error("Failed to process articles");
  }
};

/**
 * Get job status and results
 *
 * @param {string} jobId - Job ID to retrieve
 * @returns {Promise<ProcessArticlesResponse>} - Job information and results if available
 */
export const getJobResults = async (
  jobId: string
): Promise<ProcessArticlesStatusResponse> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/processStatus/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as ProcessArticlesStatusResponse;

    return data;
  } catch (error) {
    console.error("Error fetching job results:", error);
    throw new Error("Failed to fetch job results");
  }
};
