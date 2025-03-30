
/**
 * Generate a report from batch processing results
 */
export function generateProcessingReport(
  result: any
): {
  summary: string;
  details: string;
  successRate: number;
  qualitySummary?: string;
} {
  const { stats, errors, qualityReport } = result;
  
  // Calculate success rate
  const successRate = stats.totalRows > 0 
    ? (stats.successRows / stats.totalRows) * 100 
    : 0;
  
  // Generate summary
  const summary = `Processed ${stats.processedFiles} of ${stats.totalFiles} files, with ${stats.successRows} of ${stats.totalRows} rows successfully imported (${successRate.toFixed(2)}%).`;
  
  // Generate detailed error report
  let details = '';
  if (errors.length > 0) {
    details = errors.map(fileError => {
      return `File: ${fileError.file}\n${fileError.errors.map(err => `  Row ${err.row >= 0 ? err.row + 1 : 'N/A'}: ${err.message}`).join('\n')}`;
    }).join('\n\n');
  }
  
  // Generate quality summary if available
  let qualitySummary = '';
  if (qualityReport) {
    qualitySummary = `
Data Quality Report:
- Completeness: ${qualityReport.completeness.score.toFixed(1)}%
- Validity: ${qualityReport.validity.score.toFixed(1)}%
- Consistency: ${qualityReport.consistency.score.toFixed(1)}%

Issues found:
- Missing fields: ${Object.values(qualityReport.completeness.missingFields).reduce((a: number, b) => a + (b as number), 0)} instances
- Schema errors: ${qualityReport.validity.errors} errors
- Schema warnings: ${qualityReport.validity.warnings} warnings
- Consistency issues: ${qualityReport.consistency.issues.reduce((a: number, b) => a + (b.count as number), 0)} issues
`;
  }
  
  return {
    summary,
    details,
    successRate,
    qualitySummary
  };
}

/**
 * Generate standardized data quality metrics
 */
export function generateDataQualityMetrics(
  data: Array<any>,
  schema: string
): {
  completeness: number;
  accuracy: number;
  consistency: number;
  details: Record<string, any>;
} {
  // For demonstration purposes, we'll calculate simple metrics
  // In a real implementation, these would be based on actual data analysis
  
  // Count required fields
  let validTitles = 0;
  let validDescriptions = 0;
  let validImages = 0;
  let validJsonLd = 0;
  
  for (const item of data) {
    if (item.title && item.title.length > 3) validTitles++;
    if (item.description && item.description.length > 10) validDescriptions++;
    if (item.imageUrl) validImages++;
    if (item.jsonLd && item.jsonLd['@type'] === schema) validJsonLd++;
  }
  
  const total = data.length || 1; // Avoid division by zero
  
  // Calculate metrics
  const completeness = ((validTitles + validDescriptions + validImages) / (total * 3)) * 100;
  const accuracy = (validJsonLd / total) * 100;
  const consistency = Math.min(completeness, accuracy);
  
  return {
    completeness,
    accuracy,
    consistency,
    details: {
      validTitles,
      validDescriptions,
      validImages,
      validJsonLd,
      total
    }
  };
}
