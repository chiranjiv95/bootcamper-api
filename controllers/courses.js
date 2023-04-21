const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampID/courses
// @access  Public
exports.getCourses=asyncHandler(async(req, res, next)=>{
    
    if(req.params.bootcampID){
        const courses = await Course.find({bootcamp:req.params.bootcampID});
        return res.status(200).json({
            success:true,
            count:courses.length,
            data:courses
        })
    }else{
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Create new course
// @route   POST /api/v1/courses
// @access  Private
exports.createCourse=asyncHandler(async(req, res, next)=>{
    const bootcamp=await Bootcamp.findById(req.body.bootcamp);
    if(!bootcamp){
        const message=`Bootcamp with ID: ${req.body.bootcamp} doesn't exist!`;
        return next(new ErrorResponse(message , 404));
    }
    const course=await Course.create(req.body);
    res.status(201).json({success:true, data:course});
});

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse=asyncHandler( async(req, res, next)=>{
    const course=await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'title description'
    });
    if(!course){
        const message=`Course with ID: ${req.params.id} doesn't exist!`;
        return next(new ErrorResponse(message , 404));
    }
    res.status(200).json({success:true, data:course})
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse=asyncHandler(async(req, res, next)=>{
    const course=await Course.findByIdAndUpdate({_id:req.params.id},req.body, {new:true, runValidators:true});
    if(!course){
        const message=`Course with ID: ${req.params.id} doesn't exist!`;
        return next(new ErrorResponse(message , 404));
    }
    res.status(201).json({success:true, data:course});
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse=asyncHandler(async(req, res, next)=>{
    const course=await Course.findById(req.params.id);
    if(!course){
        const message=`Course with ID: ${req.params.id} doesn't exist!`;
        return next(new ErrorResponse(message , 404));
    }

    await course.deleteOne();
    res.status(200).json({success:true});
});

