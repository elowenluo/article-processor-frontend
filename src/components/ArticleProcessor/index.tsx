"use client";

import React from "react";
import Header from "../Header";
import Main from "../Main";
import Footer from "../Footer";
import styles from "./ArticleProcessor.module.scss";
import { useArticleProcessing } from "../../hooks/useArticleProcessing";

/**
 * Main app component for article processing
 */
const ArticleProcessor: React.FC = () => {
  const {
    articles,
    isProcessing,
    error,
    jobId,
    processArticles,
    processJsonData,
    loadResults,
    updateArticle,
    deleteArticle,
    copyAllArticles,
  } = useArticleProcessing();

  return (
    <div className={styles.appContainer}>
      <Header />
      <Main
        articles={articles}
        isProcessing={isProcessing}
        error={error}
        jobId={jobId}
        onSubmit={processArticles}
        onJsonSubmit={processJsonData}
        onLoadResults={loadResults}
        onArticleChange={updateArticle}
        onDeleteArticle={deleteArticle}
        onCopyAll={copyAllArticles}
      />
      <Footer />
    </div>
  );
};

export default ArticleProcessor;
