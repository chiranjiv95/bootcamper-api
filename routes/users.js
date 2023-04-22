const express=require('express');
const router=express.Router();
const User=require('../models/User');

const {getUser, getUsers, createUser, updateUser, deleteUser}=require('../controllers/users');
const {protect, authorize}=require('../middleware/auth');
const advancedResults=require('../middleware/advancedResults');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser)
router.route('/:userID').get(getUser).put(updateUser).delete(deleteUser)

module.exports=router;