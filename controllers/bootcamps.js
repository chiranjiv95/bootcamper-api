const path=require('node:path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps=asyncHandler(async (req, res, next)=>{
    res.status(200).json(res.advancedResults);
});

    
// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp=asyncHandler(async(req, res, next)=>{
        const bootcamp=await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            const message=`Bootcamp with ID: ${req.params.id} doesn't exist!`;
            return next(new ErrorResponse(message , 404));
        }
        res.status(200).json({success:true, data:bootcamp});
    });


// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp=asyncHandler(async (req, res, next)=>{
    
        const bootcamp=await Bootcamp.create(req.body);
        res.status(201).json({success:true, data: bootcamp});
});


// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp=asyncHandler(async (req, res, next)=>{
        const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
        if(!bootcamp){
            const message=`Resource with ID: ${req.params.id} doesn't exist!`;
            return next(new ErrorResponse(message , 404));
        }
        res.status(200).json({success:true, data: bootcamp});
});


// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp=asyncHandler(async (req, res, next)=>{
        const bootcamp=await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            const message=`Bootcamp with ID: ${req.params.id} doesn't exist!`;
            return next(new ErrorResponse(message , 404));
        }

        await bootcamp.deleteOne();
        res.status(200).json({success:true});
});


// File Upload
// @desc    Upload Bootcamp Photo
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload=asyncHandler(async (req, res, next)=>{
    const bootcamp=await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        const message=`Bootcamp with ID: ${req.params.id} doesn't exist!`;
        return next(new ErrorResponse(message , 404));
    }

    if(!req.files){
        const message=`Please upload a file`;
        return next(new ErrorResponse(message , 400));
    }

    const file = req.files.file;

    // Make sure the file is a photo
    if(!file.mimetype.startsWith('image')){
        const message=`Please upload an image file`;
        return next(new ErrorResponse(message , 400));
    }

    // Check for file size
    if(file.size > process.env.MAX_FILE_UPLOAD){
        const message=`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`;
        return next(new ErrorResponse(message , 400));
    }

    // Create custom filename
    file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err=>{
        if(err){
            console.log(err);
            return next(new ErrorResponse('Problem with file upload' , 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo:file.name});
        res.status(200).json({
            success:true, data:file.name
        })
    })
});




