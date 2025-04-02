import React, { useState } from "react";
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
  ];

  // Track if custom model option is selected
  const [isCustomModelSelected, setIsCustomModelSelected] = useState(model === "custom");
  // Store the actual custom model name
  const [customModelName, setCustomModelName] = useState("");

  // Compute whether to show the custom model input field
  const showCustomModelInput = isCustomModelSelected;

  const modelSelectOptions = [
    { value: "", label: "-- Select Model --" },
    ...availableModels.map((model) => ({ value: model, label: model })),
    { value: "custom", label: "Custom Model" },
  ];

  const handleModelChange = (value: string) => {
    if (value === "custom") {
      // When custom is selected, set the flag to show the input field
      setIsCustomModelSelected(true);
      // If we have a previously entered custom model name, use it
      if (customModelName) {
        onModelChange(customModelName);
      } else {
        // Otherwise just pass "custom" to parent
        onModelChange("custom");
      }
    } else {
      // For standard models, hide the custom input
      setIsCustomModelSelected(false);
      // Clear any custom model name when switching away
      setCustomModelName("");
      // Pass the selected model to parent
      onModelChange(value);
    }
  };

  const handleCustomModelChange = (value: string) => {
    // Update the custom model name
    setCustomModelName(value);
    // Pass the actual custom model name to parent
    if (value) {
      onModelChange(value);
    } else {
      // If empty, pass "custom" to maintain the custom selection state
      onModelChange("custom");
    }
  };

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
          onChange={handleModelChange}
          disabled={!provider}
        />

        {showCustomModelInput && (
          <Input
            id="custom-model-name"
            label="Custom Model Name:"
            value={customModelName}
            onChange={(e) => handleCustomModelChange(e.target.value)}
            placeholder="Enter custom model name"
            aria-label="Custom model input"
            disabled={!provider}
          />
        )}
      </div>
    </div>
  );
};

export default CustomApiSection;
