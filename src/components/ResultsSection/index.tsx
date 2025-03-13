"use client";

import React from "react";
import ResultsHeader from "./ResultsHeader";
import ResultCard from "./ResultCard";
import styles from "./ResultsSection.module.scss";
import { Article } from "../../types";

interface ResultsSectionProps {
  articles: Article[];
  onArticleChange: (index: number, updatedArticle: Article) => void;
  onDeleteArticle: (index: number) => void;
  onCopyAll: () => void;
}

/**
 * Section displaying all article processing results
 *
 * @param {Article[]} articles - Array of processed articles
 * @param {function} onArticleChange - Callback for when an article is modified
 * @param {function} onDeleteArticle - Callback for when an article is deleted
 * @param {function} onCopyAll - Callback for when copy all button is clicked
 */
const ResultsSection: React.FC<ResultsSectionProps> = ({
  articles,
  onArticleChange,
  onDeleteArticle,
  onCopyAll,
}) => {
  return (
    <section className={styles.resultsSection}>
      <ResultsHeader articles={articles} onCopyAll={onCopyAll} />

      {articles.length === 0 ? (
        <div className={styles.noResults}>
          <p>No results to display yet. Submit the form to process articles.</p>
        </div>
      ) : (
        <div className={styles.resultsList}>
          {articles.map((article, index) => (
            <ResultCard
              key={article.title}
              article={article}
              index={index}
              onDelete={() => onDeleteArticle(index)}
              onChange={(updatedArticle) =>
                onArticleChange(index, updatedArticle)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ResultsSection;
