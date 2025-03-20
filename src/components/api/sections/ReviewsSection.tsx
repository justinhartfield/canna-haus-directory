
import React from 'react';
import ApiExample from '@/components/ApiExample';

const ReviewsSection: React.FC = () => {
  const postReviewExample = `{
  "entityId": "strain-123",
  "rating": 4.5,
  "review": "This strain has been very effective for my chronic pain...",
  "medicalCondition": "Chronic Pain",
  "effectivenessRating": 5,
  "sideEffects": ["Dry Mouth", "Hunger"],
  "verifiedPurchase": true
}`;

  const postReviewResponseExample = `{
  "success": true,
  "reviewId": "review-789",
  "status": "pending-verification",
  "message": "Thank you for your review. It will be published after verification."
}`;

  return (
    <section id="reviews" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">User Reviews API</h2>
      <p className="mb-6">
        Submit and retrieve user reviews for cannabis strains, products, and research with detailed effectiveness ratings.
      </p>
      
      <div className="space-y-6">
        <ApiExample
          endpoint="/reviews"
          method="POST"
          description="Submit a new user review for a cannabis-related entry."
          requestExample={postReviewExample}
          responseExample={postReviewResponseExample}
        />
      </div>
    </section>
  );
};

export default ReviewsSection;
