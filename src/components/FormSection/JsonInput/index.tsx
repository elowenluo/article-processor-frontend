import React from "react";
import TextArea from "../../UI/TextArea";
import styles from "./JsonInput.module.scss";

interface JsonInputProps {
  jsonData: string;
  onChange: (value: string) => void;
}

/**
 * JSON input component for direct data parsing
 */
const JsonInput: React.FC<JsonInputProps> = ({ jsonData, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.jsonInput}>
      <label className={styles.label}>JSON 数据:</label>
      <TextArea
        value={jsonData}
        onChange={handleChange}
        placeholder={`请输入JSON数据，格式如下：
{
  "status": "completed",
  "jobId": "mock-job-id",
  "results": [
    {
      "url": "https://example.com/article1",
      "title": "Sample Article",
      "content": "Article content here...",
      "summary": "Article summary here...",
      "tags": ["tag1", "tag2"],
      "categories": ["category1", "category2"]
    }
  ]
}`}
        rows={15}
        className={styles.textarea}
      />
      <p className={styles.hint}>
        直接粘贴包含 status, jobId 和 results 的 JSON 数据
      </p>
    </div>
  );
};

export default JsonInput;