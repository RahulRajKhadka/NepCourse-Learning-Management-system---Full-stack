import Courses from "../Model/courseModel.js";
import Review from "../Model/reviewModel.js";


export const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    console.log("📝 Creating review:", { courseId, userId, rating, comment: comment?.substring(0, 50) });

    if (!rating || !comment) {
      return res.status(400).json({ 
        success: false,
        message: "Rating and comment are required" 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false,
        message: "Rating must be between 1 and 5" 
      });
    }

    if (comment.trim().length < 10) {
      return res.status(400).json({ 
        success: false,
        message: "Comment must be at least 10 characters" 
      });
    }

    // Check if course exists
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: "Course not found" 
      });
    }

    // Check if user has already reviewed
    const alreadyReviewed = await Review.findOne({ 
      user: userId, 
      course: courseId 
    });
    
    if (alreadyReviewed) {
      return res.status(400).json({ 
        success: false,
        message: "You have already reviewed this course" 
      });
    }

   
    const review = new Review({
      user: userId,
      course: courseId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    await review.save();
    console.log(" Review saved:", review._id);

   
    course.reviews.push(review._id);
    await course.save();
    console.log(" Course updated with review ID");

    await review.populate("user", "name photoUrl role");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review
    });
  } catch (error) {
    console.error(" Error creating review:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating review", 
      error: error.message 
    });
  }
};

// Get all reviews for a specific course
export const getReviewsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    console.log("Fetching reviews for course:", courseId);

    // Check if course exists
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: "Course not found" 
      });
    }

    // Fetch reviews
    const reviews = await Review.find({ course: courseId })
      .populate("user", "name photoUrl role")
      .sort({ reviewedAt: -1 });

    console.log(` Found ${reviews.length} reviews`);

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      reviews,
      averageRating,
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching reviews", 
      error: error.message 
    });
  }
};

export const checkUserReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    console.log("🔍 Checking if user reviewed course:", { userId, courseId });

    const review = await Review.findOne({ 
      user: userId, 
      course: courseId 
    });

    console.log(review ? " User has reviewed" : " User has not reviewed");

    res.status(200).json({
      success: true,
      hasReviewed: !!review,
      review: review || null
    });
  } catch (error) {
    console.error(" Error checking user review:", error);
    res.status(500).json({ 
      success: false,
      message: "Error checking review", 
      error: error.message 
    });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: "Review not found" 
      });
    }

   
    if (review.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to delete this review" 
      });
    }

  
    await Courses.findByIdAndUpdate(
      review.course,
      { $pull: { reviews: reviewId } }
    );

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting review", 
      error: error.message 
    });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: "Review not found" 
      });
    }

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to update this review" 
      });
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        success: false,
        message: "Rating must be between 1 and 5" 
      });
    }

    if (comment && comment.trim().length < 10) {
      return res.status(400).json({ 
        success: false,
        message: "Comment must be at least 10 characters" 
      });
    }

   
    if (rating) review.rating = rating;
    if (comment) review.comment = comment.trim();
    review.reviewedAt = Date.now();

    await review.save();
    await review.populate("user", "name photoUrl role");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review
    });
  } catch (error) {
    console.error("❌ Error updating review:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating review", 
      error: error.message 
    });
  }
};