
import React from 'react';
import ApiExample from '@/components/ApiExample';

interface HttpMethodExampleProps {
  title: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  description: string;
  requestExample?: string;
  responseExample: string;
}

const HttpMethodExample: React.FC<HttpMethodExampleProps> = ({
  title,
  endpoint,
  method,
  description,
  requestExample,
  responseExample
}) => {
  // ApiExample component doesn't accept PATCH, so we need to cast it
  const apiMethod = method === "PATCH" ? "PUT" as const : method;

  return (
    <div className="glass-card rounded-xl p-6 mb-6">
      <h4 className="text-lg font-medium mb-3">{title}</h4>
      <ApiExample
        endpoint={endpoint}
        method={apiMethod}
        description={description}
        requestExample={requestExample}
        responseExample={responseExample}
      />
    </div>
  );
};

export default HttpMethodExample;
