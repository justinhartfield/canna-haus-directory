
import React from 'react';
import FilterExamplesSection from './endpoint-optimization/FilterExamplesSection';
import HttpMethodsSection from './endpoint-optimization/HttpMethodsSection';
import PaginationExample from './endpoint-optimization/PaginationExample';

const EndpointOptimizationSection: React.FC = () => {
  return (
    <section id="endpoint-optimization" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Endpoint Optimization</h2>
      <p className="mb-6">
        Our API provides optimized endpoints for filtering and retrieving data based on various parameters. These endpoints support a range of query options to help you find exactly what you're looking for.
      </p>

      <FilterExamplesSection />
      <HttpMethodsSection />
      <PaginationExample />
    </section>
  );
};

export default EndpointOptimizationSection;
