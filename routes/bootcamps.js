const express=require('express');
const {
    getBootcamps, 
    getBootcamp, 
    updateBootcamp, 
    deleteBootcamp, 
    createBootcamp,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp=require('../models/Bootcamp');
const advancedResults=require('../middleware/advancedResults');
const {protect, authorize}=require('../middleware/auth');

// Include other resource routers
const courseRouter = require('./courses');

const router=express.Router();

// Re-route into other resource routers
router.use('/:bootcampID/courses', courseRouter);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports=router;