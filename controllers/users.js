const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Get All Users
// @route   /api/v1/users
// @access  Private
exports.getUsers=asyncHandler(async(req, res, next)=>{
    res.status(200).json(res.advancedResults);
});

// @desc    Get Single User
// @route   /api/v1/users/:userID
// @access  Private
exports.getUser=asyncHandler(async(req, res, next)=>{
    const user=await User.findById(req.params.userID);
    if(!user){
        return next(new ErrorResponse(`User with ID ${req.params.userID} does not exist`), 404);
    }
    res.status(200).json({success:true, user});
});

// @desc    Create User
// @route   /api/v1/users
// @access  Private
exports.createUser=asyncHandler(async(req, res, next)=>{
    const user=await User.create(req.body);
    res.status(201).json({success:true, data:user});
});

// @desc    Update User
// @route   /api/v1/users/:userID
// @access  Private
exports.updateUser=asyncHandler(async(req, res, next)=>{
    const user=await User.findByIdAndUpdate(req.params.userID, req.body, {
        new:true,
        runValidators:true
    });

    res.status(200).json({success:true, data:user});
});


// @desc    Delete User
// @route   /api/v1/users/:userID
// @access  Private
exports.deleteUser=asyncHandler(async(req, res, next)=>{
    const user=await User.findByIdAndDelete(req.params.userID);
    if(!user){
        return next(new ErrorResponse(`User with ID ${req.params.userID} does not exist`, 404));
    }
    res.status(200).json({success:true});
});