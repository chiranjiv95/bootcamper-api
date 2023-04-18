const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps=asyncHandler(async (req, res, next)=>{

    const reqQuery={...req.query};

    const removeFields=['select', 'sort', 'limit', 'page'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryString=(JSON.stringify(reqQuery));
    queryString=queryString.replace(/\b(lt|lte|gt|gte|in)\b/g, match=> `$${match}`);
   
    let result=Bootcamp.find(JSON.parse(queryString));
  
    // Select Fields
    if(req.query.select){
        const fieldSet=req.query.select.split(',').join(' ');
        result=result.select(fieldSet);
    };

    // Sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        result=result.sort(sortBy);
    } else {
        result=result.sort('-createdAt')
    }
    
    // Pagination & limit
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 25;
    const startIndex=(page - 1) * limit;
    const endIndex= page * limit;
    const total=await Bootcamp.countDocuments();

    result=result.skip(startIndex).limit(limit);

    // Executing query
    const bootcamps=await result;

    // Pagination Object
    const pagination={};

    if(endIndex<total){
        pagination.next={
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0){
        pagination.prev={
            page: page - 1,
            limit
        }
    }

    if(bootcamps.length<1){           
        return res.status(200).json({success:true, msg:`No bootcamps found`});
    }
    res.status(200).json({success:true, pagination, count:bootcamps.length, data:bootcamps});
});

    
// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamp/:id
// @access  Public
exports.getBootcamp=asyncHandler(async(req, res, next)=>{
        const bootcamp=await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            const message=`Resource with ID: ${req.params.id} doesn't exist!`;
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
        const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            const message=`Resource with ID: ${req.params.id} doesn't exist!`;
            return next(new ErrorResponse(message , 404));
        }
        res.status(200).json({success:true});
});





