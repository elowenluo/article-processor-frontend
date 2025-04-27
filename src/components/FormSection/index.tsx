"use client";

import React from "react";
import Button from "../UI/Button";
import ApiToggle from "./ApiToggle";
import StandardApiSection from "./StandardApiSection";
import CustomApiSection from "./CustomApiSection";
import UrlsInput from "./UrlsInput";
import ApiKeyInput from "./ApiKeyInput";
import JobIdRecovery from "./JobIdRecovery";
import styles from "./FormSection.module.scss";
import { ApiConfig, ApiProvider, ApiType } from "../../types";
import { useLocalStorage } from "../../hooks/useLocalStorage";

// Define the form state shape for localStorage
interface FormState {
  apiType: ApiType;
  urls: string;
  apiKey: string;
  standardProvider: ApiProvider;
  standardModel: string;
  customProvider: ApiProvider;
  customModel: string;
  customUrl: string;
}

interface FormSectionProps {
  onSubmit: (urls: string[], apiConfig: ApiConfig) => void;
  onLoadResults: (jobId: string) => void;
  isProcessing: boolean;
}

/**
 * Form section for configuring article processing
 *
 * @param {function} onSubmit - Callback for when form is submitted
 * @param {function} onLoadResults - Callback for when job results are requested
 * @param {boolean} isProcessing - Whether a processing job is currently running
 */
const FormSection: React.FC<FormSectionProps> = ({
  onSubmit,
  onLoadResults,
  isProcessing,
}) => {
  // Initial form state
  const initialFormState: FormState = {
    apiType: "standard",
    urls: "",
    apiKey: "",
    standardProvider: "",
    standardModel: "",
    customProvider: "",
    customModel: "",
    customUrl: "",
  };

  // Load form state from localStorage
  const [formState, setFormState] = useLocalStorage<FormState>(
    "article-processor-form-state",
    initialFormState
  );

  // Destructure form state for easier access
  const {
    apiType,
    urls,
    apiKey,
    standardProvider,
    standardModel,
    customProvider,
    customModel,
    customUrl,
  } = formState;

  // Store models for each provider in localStorage to avoid repeated fetching
  const [providerModels] = useLocalStorage<Record<ApiProvider, string[]>>(
    "article-processor-provider-models",
    {
      openai: [],
      google: [],
      claude: [],
      grok: [],
      "": [],
    }
  );

  // Update individual form fields
  const updateFormField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Set URL value
  const setUrls = (value: string) => {
    updateFormField("urls", value);
  };

  // Set API type
  const setApiType = (type: ApiType) => {
    updateFormField("apiType", type);
  };

  // Set standard provider
  const setStandardProvider = (provider: ApiProvider) => {
    updateFormField("standardProvider", provider);
  };

  // Set standard model
  const setStandardModel = (model: string) => {
    updateFormField("standardModel", model);
  };

  // Set custom provider
  const setCustomProvider = (provider: ApiProvider) => {
    updateFormField("customProvider", provider);
  };

  // Set custom model
  const setCustomModel = (model: string) => {
    updateFormField("customModel", model);
  };

  // Set custom URL
  const setCustomUrl = (url: string) => {
    updateFormField("customUrl", url);
  };

  // Set API key
  const setApiKey = (key: string) => {
    updateFormField("apiKey", key);
  };

  // Form validation
  const isFormValid = () => {
    const urlsValid = urls.trim() !== "";
    const apiKeyValid = apiKey.trim() !== "";

    if (apiType === "standard") {
      return (
        urlsValid &&
        apiKeyValid &&
        standardProvider !== "" &&
        standardModel !== ""
      );
    } else {
      return (
        urlsValid &&
        apiKeyValid &&
        customProvider !== "" &&
        customModel !== "" &&
        customUrl.trim() !== ""
      );
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url !== "");

    const apiConfig: ApiConfig = {
      type: apiType,
      provider: apiType === "standard" ? standardProvider : customProvider,
      model: apiType === "standard" ? standardModel : customModel,
      apiKey,
      customUrl: apiType === "custom" ? customUrl : undefined,
    };

    onSubmit(urlList, apiConfig);
  };

  // Helper function to get default models for a provider
  const getDefaultModelsForProvider = (provider: ApiProvider): string[] => {
    switch (provider) {
      case "openai":
        return ["gpt-3.5-turbo", "gpt-4o"];
      case "google":
        return ["gemini-1.5-pro", "gemini-2.0-flash"];
      case "claude":
        return ["claude-3-5-haiku", "claude-3-5-sonnet", "claude-3-7-sonnet"];
      case "grok":
        return ["grok-3-beta"];
      default:
        return [];
    }
  };

  // Function to get models for the current provider
  const getModelsForProvider = (provider: ApiProvider): string[] => {
    return providerModels[provider].length > 0
      ? providerModels[provider]
      : getDefaultModelsForProvider(provider);
  };

  return (
    <section className={styles.formSection}>
      <form onSubmit={handleSubmit}>
        <UrlsInput urls={urls} onChange={setUrls} />

        <ApiToggle activeApi={apiType} onToggle={setApiType} />

        {apiType === "standard" ? (
          <StandardApiSection
            provider={standardProvider}
            model={standardModel}
            onProviderChange={setStandardProvider}
            onModelChange={setStandardModel}
            availableModels={getModelsForProvider(standardProvider)}
          />
        ) : (
          <CustomApiSection
            provider={customProvider}
            model={customModel}
            customUrl={customUrl}
            onProviderChange={setCustomProvider}
            onModelChange={setCustomModel}
            onCustomUrlChange={setCustomUrl}
            availableModels={getModelsForProvider(customProvider)}
          />
        )}

        <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />

        <Button
          type="submit"
          disabled={!isFormValid() || isProcessing}
          fullWidth
          className={styles.submitButton}
        >
          {isProcessing ? "Processing..." : "Process Articles"}
        </Button>

        <JobIdRecovery onLoadResults={onLoadResults} />
      </form>
    </section>
  );
};

export default FormSection;
