import React from "react";
import FormSection from "../FormSection";
import ResultsSection from "../ResultsSection";
import LoadingSection from "../LoadingSection";
import ErrorSection from "../ErrorSection";
import styles from "./Main.module.scss";
import { ApiConfig, Article } from "../../types";

interface MainProps {
  articles: Article[];
  isProcessing: boolean;
  error: string | null;
  jobId: string | null;
  onSubmit: (urls: string[], apiConfig: ApiConfig) => void;
  onJsonSubmit: (jsonData: string) => void;
  onLoadResults: (jobId: string) => void;
  onArticleChange: (index: number, updatedArticle: Article) => void;
  onDeleteArticle: (index: number) => void;
  onCopyAll: () => void;
}

/**
 * Main content area containing form and results
 */
const Main: React.FC<MainProps> = ({
  articles,
  isProcessing,
  error,
  jobId,
  onSubmit,
  onJsonSubmit,
  onLoadResults,
  onArticleChange,
  onDeleteArticle,
  onCopyAll,
}) => {
  return (
    <main className={styles.main}>
      <div className={styles.formColumn}>
        <FormSection
          onSubmit={onSubmit}
          onJsonSubmit={onJsonSubmit}
          onLoadResults={onLoadResults}
          isProcessing={isProcessing}
        />
      </div>

      <div className={styles.resultsColumn}>
        <ResultsSection
          articles={articles}
          onArticleChange={onArticleChange}
          onDeleteArticle={onDeleteArticle}
          onCopyAll={onCopyAll}
        />
      </div>

      {isProcessing && jobId && <LoadingSection jobId={jobId} />}

      {error && <ErrorSection message={error} />}
    </main>
  );
};

export default Main;
