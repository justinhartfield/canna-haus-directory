
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { sampleData, availableCategories } = await req.json();
    
    if (!sampleData || !Array.isArray(sampleData) || sampleData.length === 0) {
      throw new Error("No sample data provided");
    }
    
    // Convert the sample data to a string representation
    const sampleDataString = JSON.stringify(sampleData[0], null, 2);
    
    // Get all column headers from the sample data
    const allColumns = Object.keys(sampleData[0]);
    
    // Prepare available categories as comma-separated string
    const categoriesString = Array.isArray(availableCategories) 
      ? availableCategories.join(", ") 
      : "Strains, Medical, Extraction, Cultivation, Dispensaries, Lab Data, Compliance, Products, Educational";
    
    // Construct the prompt for OpenAI
    const systemPrompt = `
    You are a data categorization assistant that specializes in cannabis industry data. 
    Your task is to analyze CSV/Excel data and determine the best category for it.
    You'll be provided with a sample row from a CSV/Excel file, and you need to:
    
    1. Analyze the column headers and values
    2. Determine which of the following categories is the best fit: ${categoriesString}
    3. Provide a brief explanation for your choice
    4. Map EVERY column in the data to an appropriate field
    5. Create custom fields as needed if the standard fields (title, description, subcategory, tags) don't cover all the data
    6. Do not combine multiple columns into a single field unless absolutely necessary and logical to do so
    7. Recommend the most appropriate Schema.org type for this data
    
    The data includes these columns: ${allColumns.join(", ")}
    
    IMPORTANT: Every column must be mapped to a field. Do not skip any columns.
    
    Respond with JSON in this format:
    {
      "recommendedCategory": "category name",
      "explanation": "brief explanation why this is the appropriate category",
      "mappings": {
        "title": "column name for title",
        "description": "column name for description",
        "subcategory": "column name for subcategory",
        "tags": "column name for tags",
        "customField1": "column name for custom field 1",
        "customField2": "column name for custom field 2"
        // ... include mappings for ALL columns
      },
      "schemaType": "recommended schema.org type"
    }
    `;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here's a sample row from my data:\n${sampleDataString}` }
        ],
        temperature: 0.2,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // Parse the generated content to get the JSON response
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Failed to get a valid response from OpenAI");
    }
    
    // Extract the JSON from the response - handle cases where model might add surrounding text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    
    let result;
    try {
      // Parse the JSON response
      result = JSON.parse(jsonString);
      
      // Verify that all columns are mapped
      const mappedColumns = Object.values(result.mappings);
      const unmappedColumns = allColumns.filter(col => !mappedColumns.includes(col));
      
      // If there are unmapped columns, add them as custom fields
      if (unmappedColumns.length > 0) {
        console.log(`Adding ${unmappedColumns.length} unmapped columns as custom fields`);
        unmappedColumns.forEach((col, idx) => {
          const fieldName = `customField${Object.keys(result.mappings).length + idx + 1}`;
          result.mappings[fieldName] = col;
        });
      }
      
      // Verify that all columns are now mapped
      const finalMappedColumns = Object.values(result.mappings);
      console.log(`Original columns: ${allColumns.length}, Mapped columns: ${finalMappedColumns.length}`);
      
    } catch (parseError) {
      console.error('Error parsing JSON from OpenAI response:', parseError);
      console.log('Raw response:', content);
      throw new Error("Failed to parse OpenAI response as JSON");
    }
    
    // Return the classification result
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in classify-csv-data function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred during classification' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
