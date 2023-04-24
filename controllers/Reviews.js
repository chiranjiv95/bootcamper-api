const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('../middleware/async');
const Review=require('../models/Review');
const Bootcamp=require('../models/Bootcamp');


// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews=asyncHandler(async(req, res, next)=>{
    if(req.params.bootcampID){
        const reviews=await Review.find({bootcamp:req.params.bootcampID});
        res.status(200).json({success:true, count:reviews.length, data: reviews});
    }
    res.status(200).json(res.advancedResults);
});

// @desc    Get single review
// @route   GET /api/v1/reviews/:reviewID
// @access  Public
exports.getReview=asyncHandler(async(req, res, next)=>{
    const review=await Review.findById(req.params.reviewID).populate({
        path:'bootcamp',
        select:'name description'
    });
    if(!review){
        return next(new ErrorResponse(`No review with ID ${req.params.reviewID} exists`, 404));
    }
    res.status(200).json({success:true,  data: review});
});

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview=asyncHandler(async(req, res, next)=>{
    
    req.body.user=req.user._id;
    const bootcamp=await Bootcamp.findById(req.body.bootcamp);
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with ID ${req.body.bootcamp} exists`, 404));
    }

    const review=await Review.create(req.body);

    res.status(201).json({success:true, data:review});
});   

// @desc    Update review
// @route   PUT /api/v1/reviews/:reviewID
// @access  Private
exports.updateReview=asyncHandler(async(req, res, next)=>{
    
    const fieldsToUpdate={
        title:req.body.title,
        description:req.body.description
    };

    let review=await Review.findById(req.params.reviewID);
    if(!review){
        const message=`Review with ID: ${req.params.reviewID} doesn't exist!`;
        return next(new ErrorResponse(message , 404));
    };

    // Make sure the user is review owner
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 401));
    };

    review=await Review.findByIdAndUpdate(req.params.reviewID, fieldsToUpdate, {
        new:true, runValidators:true
    })

    res.status(200).json({success:true, data:review});
});   

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:reviewID
// @access  Private
exports.deleteReview=asyncHandler(async(req, res, next)=>{
    
    let review=await Review.findById(req.params.reviewID);
    if(!review){
        const message=`Review with ID: ${req.params.reviewID} doesn't exist!`;
        return next(new ErrorResponse(message , 404));
    };

    // Make sure the user is review owner
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 401));
    };

    await review.deleteOne();

    res.status(200).json({success:true});
});  