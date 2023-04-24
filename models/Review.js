const mongoose=require('mongoose');

const ReviewSchema=mongoose.Schema({
    title:{
        type:String,
        required:[true, 'Please add a review title'],
        maxlength:100
    },
    description:{
        type:String,
        required:[true, 'Please add a review description']
    },
    rating:{
        type:Number,
        required:[true, 'Please add a rating between 1 and 10'],
        min:1,
        max:10,
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({bootcamp:1, user:1}, { unique:true });

// Static method to calculate average of bootcamp ratings
ReviewSchema.statics.getAverageRating = async function(bootcampID){
    const obj=await this.aggregate([
        {
            $match : { bootcamp: bootcampID}
        },
        {
            $group : {
                _id: '$bootcamp',
                averageRating: { $avg:'$rating'}
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampID, {
            averageRating: obj[0]?.averageRating || 0
        })
    } catch (error) {
        console.log(error);
    }
}

// Call getAverageRating after save
ReviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.bootcamp);
})

// Call getAverageCost before remove
ReviewSchema.pre('deleteOne', {document:true},  function(){
    this.constructor.getAverageRating(this.bootcamp);
})

module.exports=mongoose.model('Review', ReviewSchema);