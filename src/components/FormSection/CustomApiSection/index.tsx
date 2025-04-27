import React from "react";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import styles from "./CustomApiSection.module.scss";
import { ApiProvider } from "../../../types";

interface CustomApiSectionProps {
  provider: ApiProvider;
  model: string;
  customUrl: string;
  onProviderChange: (provider: ApiProvider) => void;
  onModelChange: (model: string) => void;
  onCustomUrlChange: (url: string) => void;
  availableModels: string[];
}

/**
 * Form section for custom API configuration
 *
 * @param {ApiProvider} provider - Selected API provider
 * @param {string} model - Selected model
 * @param {string} customUrl - Custom API URL
 * @param {function} onProviderChange - Callback for provider change
 * @param {function} onModelChange - Callback for model change
 * @param {function} onCustomUrlChange - Callback for custom URL change
 * @param {string[]} availableModels - Available models for selected provider
 */
const CustomApiSection: React.FC<CustomApiSectionProps> = ({
  provider,
  model,
  customUrl,
  onProviderChange,
  onModelChange,
  onCustomUrlChange,
  availableModels,
}) => {
  const providerOptions = [
    { value: "", label: "-- Select Provider --" },
    { value: "openai", label: "OpenAI" },
    { value: "google", label: "Google AI Studio" },
    { value: "claude", label: "Anthropic" },
    { value: "grok", label: "Grok" },
  ];

  const modelSelectOptions = [
    { value: "", label: "-- Select Model --" },
    ...availableModels.map((model) => ({ value: model, label: model })),
  ];

  return (
    <div id="custom-api-section">
      <Input
        id="customUrl"
        label="API URL:"
        type="url"
        placeholder="https://api.openai.com/v1/chat/completions"
        value={customUrl}
        onChange={(e) => onCustomUrlChange(e.target.value)}
        required
      />

      <div className={styles.formRow}>
        <Select
          id="custom-provider"
          label="LLM Provider:"
          options={providerOptions}
          value={provider}
          onChange={(value) => onProviderChange(value as ApiProvider)}
        />

        <Select
          id="custom-model"
          label="Model:"
          options={modelSelectOptions}
          value={model}
          onChange={onModelChange}
          disabled={!provider}
        />
      </div>
    </div>
  );
};

export default CustomApiSection;
