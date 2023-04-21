const advancedResults=(model, populate)=>async (req, res, next)=>{

    
    const reqQuery={...req.query};

    const removeFields=['select', 'sort', 'limit', 'page'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryString=(JSON.stringify(reqQuery));
    queryString=queryString.replace(/\b(lt|lte|gt|gte|in)\b/g, match=> `$${match}`);
   
    // Finding resource
    let query=model.find(JSON.parse(queryString));
  
    // Select Fields
    if(req.query.select){
        const fieldSet=req.query.select.split(',').join(' ');
        query=query.select(fieldSet);
    };

    // Sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    } else {
        query=query.sort('-createdAt')
    }
    
    // Pagination & limit
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 25;
    const startIndex=(page - 1) * limit;
    const endIndex= page * limit;
    const total=await model.countDocuments();

    query=query.skip(startIndex).limit(limit);

    if(populate){
        query=query.populate(populate);
    }

    // Executing query
    const resource=await query;

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

   res.advancedResults={
    success:true,
    count:resource.length,
    pagination,
    data:resource
   };

   next();
}

module.exports=advancedResults;