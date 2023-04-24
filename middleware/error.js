const ErrorResponse=require('../utils/errorResponse');

const errorHandler=(err, req, res, next)=>{

    let error={...err};
    error.message=err.message;
    
    // Mongoose bad ObjectID
    if(err.name==='CastError'){
        const message=`Resource not found`;
        error = new ErrorResponse(message, 400);
    }

    // Mongose Duplicate key
    if(err.code === 11000){
        const message='Duplicate field value entered';
        error=new ErrorResponse(message, 400);
    }

    // Mongoose Validation
    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map((e)=>e.message);
        error=new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({success:false, error: error.message || 'Server error'});
};

module.exports=errorHandler;