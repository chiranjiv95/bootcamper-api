const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    title:{
        type:String,
        required:[true, 'Please add a course'],
        trim:true
    },
    description:{
        type:String,
        required:[true, 'Please add a description']
    },
    weeks:{
        type:String,
        required:[true, 'Please add number of weeks']
    },
    tuition:{
        type:Number,
        required:[true, 'Please add a tuition cose']
    },
    minimumSkill:{
        type:String,
        required:[true, 'Please add a minimum skill'],
        enum:['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    }
});

// Static method to calculate average of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampID){
    const obj=await this.aggregate([
        {
            $match : { bootcamp: bootcampID}
        },
        {
            $group : {
                _id: '$bootcamp',
                averageCost: { $avg:'$tuition'}
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampID, {
            averageCost: Math.ceil(obj[0]?.averageCost || 0)
        })
    } catch (error) {
        console.log(error);
    }
}

// Call getAverageCost after save
CourseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp);
})

// Call getAverageCost before remove
CourseSchema.pre('deleteOne', {document:true}, function(){
    this.constructor.getAverageCost(this.bootcamp);
})

module.exports = mongoose.model('Course', CourseSchema);