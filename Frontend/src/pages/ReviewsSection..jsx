import { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { serverUrl } from '../App';
import axios from 'axios';

const ReviewsSection = ({ courseId, isEnrolled }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [userReviewData, setUserReviewData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

 
  useEffect(() => {
    fetchReviews();
    if (isEnrolled) {
      checkUserReview();
    }
  }, [courseId, isEnrolled]);

  
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${serverUrl}/api/review/getreviews/${courseId}`
      );
      
      if (response.data) {
        setReviews(response.data.reviews || []);
        setAverageRating(response.data.averageRating || 0);
        setTotalReviews(response.data.totalReviews || 0);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.response?.data?.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };


  const checkUserReview = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/review/check/${courseId}`,
        { withCredentials: true }
      );
      
      if (response.data) {
        setHasSubmittedReview(response.data.hasReviewed);
        setUserReviewData(response.data.review);
        
        // If user has reviewed, populate the form for editing
        if (response.data.review) {
          setUserReview({
            rating: response.data.review.rating,
            comment: response.data.review.comment
          });
        }
      }
    } catch (error) {
      console.error("Error checking user review:", error);
      setHasSubmittedReview(false);
    }
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  const handleStarClick = (rating) => {
    setUserReview({ ...userReview, rating });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (userReview.rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    if (userReview.comment.trim().length < 10) {
      alert("Please write at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await axios.post(
        `${serverUrl}/api/review/createreview/${courseId}`,
        {
          rating: userReview.rating,
          comment: userReview.comment.trim()
        },
        { withCredentials: true }
      );

      if (response.data) {
        alert(" Review submitted successfully!");
        setHasSubmittedReview(true);
        setUserReviewData(response.data.review);
        setIsEditing(false);
        
        // Refresh reviews
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit review";
      alert(` ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    
    if (userReview.rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    if (userReview.comment.trim().length < 10) {
      alert("Please write at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await axios.put(
        `${serverUrl}/api/review/update/${userReviewData._id}`,
        {
          rating: userReview.rating,
          comment: userReview.comment.trim()
        },
        { withCredentials: true }
      );

      if (response.data) {
        alert("Review updated successfully!");
        setUserReviewData(response.data.review);
        setIsEditing(false);
        
        // Refresh reviews
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error updating review:", error);
      const errorMessage = error.response?.data?.message || "Failed to update review";
      alert(`${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      setSubmitting(true);
      
      const response = await axios.delete(
        `${serverUrl}/api/review/delete/${userReviewData._id}`,
        { withCredentials: true }
      );

      if (response.data) {
        alert("Review deleted successfully!");
        setHasSubmittedReview(false);
        setUserReviewData(null);
        setUserReview({ rating: 0, comment: "" });
        setShowDeleteConfirm(false);
        
        // Refresh reviews
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete review";
      alert(` ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUserReview({
      rating: userReviewData.rating,
      comment: userReviewData.comment
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserReview({
      rating: userReviewData.rating,
      comment: userReviewData.comment
    });
  };

  const renderStars = (rating, interactive = false, size = "w-5 h-5") => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isFilled = interactive
        ? star <= (hoveredRating || userReview.rating)
        : star <= rating;
      
      return (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && handleStarClick(star)}
          onMouseEnter={() => interactive && setHoveredRating(star)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-200`}
        >
          {isFilled ? (
            <FaStar className={`${size} text-yellow-400`} />
          ) : (
            <FaRegStar className={`${size} text-gray-300`} />
          )}
        </button>
      );
    });
  };

  if (loading) {
    return (
      <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Student Reviews
        </h2>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Rating Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 pb-8 border-b border-gray-200">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating || '0.0'}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {renderStars(Math.round(parseFloat(averageRating)))}
            </div>
            <p className="text-gray-600 text-sm">
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium text-gray-700">{star}</span>
                  <FaStar className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form - Create or Edit */}
        {isEnrolled && (!hasSubmittedReview || isEditing) && (
          <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Your Review' : 'Share Your Experience'}
              </h3>
              {isEditing && (
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
            <form onSubmit={isEditing ? handleUpdateReview : handleSubmitReview} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center gap-2">
                  {renderStars(userReview.rating, true, "w-8 h-8")}
                  {userReview.rating > 0 && (
                    <span className="ml-3 text-lg font-semibold text-gray-700">
                      {userReview.rating} {userReview.rating === 1 ? 'Star' : 'Stars'}
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={userReview.comment}
                  onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                  placeholder="Share your thoughts about this course... (minimum 10 characters)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  required
                  disabled={submitting}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {userReview.comment.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting || userReview.rating === 0 || userReview.comment.trim().length < 10}
                  className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isEditing ? 'Updating...' : 'Submitting...'}
                    </span>
                  ) : (
                    isEditing ? 'Update Review' : 'Submit Review'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User's Review Display (when not editing) */}
        {isEnrolled && hasSubmittedReview && !isEditing && userReviewData && (
          <div className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Your Review</h3>
                <div className="flex items-center gap-1">
                  {renderStars(userReviewData.rating)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <FaEdit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <FaTrash className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {userReviewData.comment}
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Reviewed on {new Date(userReviewData.reviewedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Review?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your review? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteReview}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message for non-enrolled users */}
        {!isEnrolled && (
          <div className="mb-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-gray-600 font-medium">
                Enroll in this course to leave a review and share your experience with other students.
              </p>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            All Reviews ({totalReviews})
          </h3>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 font-medium">No reviews yet.</p>
              <p className="text-gray-400 text-sm mt-1">Be the first to review this course!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {review.user?.photoUrl ? (
                      <img
                        src={review.user.photoUrl}
                        alt={review.user.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {review.user?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.user?.name || 'Anonymous User'}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {new Date(review.reviewedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed break-words">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;