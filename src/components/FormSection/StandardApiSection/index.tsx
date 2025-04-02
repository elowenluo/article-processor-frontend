import React from "react";
import Select from "../../UI/Select";
import styles from "./StandardApiSection.module.scss";
import { ApiProvider } from "../../../types";

type Model = string;

interface StandardApiSectionProps {
  provider: ApiProvider;
  model: string;
  onProviderChange: (provider: ApiProvider) => void;
  onModelChange: (model: string) => void;
  availableModels: string[];
}

/**
 * Form section for standard API configuration
 *
 * @param {ApiProvider} provider - Selected API provider
 * @param {string} model - Selected model
 * @param {function} onProviderChange - Callback for provider change
 * @param {function} onModelChange - Callback for model change
 * @param {string[]} availableModels - Available models for selected provider
 */
const StandardApiSection: React.FC<StandardApiSectionProps> = ({
  provider,
  model,
  onProviderChange,
  onModelChange,
  availableModels,
}: StandardApiSectionProps) => {
  const providerOptions = [
    { value: "", label: "-- Select Provider --" },
    { value: "openai", label: "OpenAI" },
    { value: "google", label: "Google AI Studio" },
    { value: "claude", label: "Anthropic" },
  ];

  const modelSelectOptions = [
    { value: "", label: "-- Select Model --" },
    ...availableModels.map((model) => ({ value: model, label: model })),
  ];

  const handleModelChange = (value: Model) => {
    onModelChange(value);
  };



  return (
    <div id="standard-api-section">
      <div className={styles.formRow}>
        <Select
          id="provider"
          label="LLM Provider:"
          options={providerOptions}
          value={provider}
          onChange={(value: string) => onProviderChange(value as ApiProvider)}
          aria-label="LLM Provider select"
        />

        <Select
          id="model"
          label="Model:"
          options={modelSelectOptions}
          value={model}
          onChange={handleModelChange}
          disabled={!provider}
          aria-label="Model select"
        />
      </div>
    </div>
  );
};

export default StandardApiSection;
