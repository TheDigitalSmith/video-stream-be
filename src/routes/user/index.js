const express = require("express");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express.Router();
const { User, validateUser } = require("../../schema/user");
const auth = require('../../utils/middleware/auth');
const validate = require('../../utils/middleware/validate');

router.get('/', async(req,res)=>{
    const users = await User.find({}).select({password:0});
    res.send(users)
})

router.get('/me',auth, async(req,res)=>{
    const user = await User.findById(req.user._id).select({password:0});
    res.send(user)
})

router.post("/", validate(validateUser) ,async (req, res) => {
  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send('User already registered');

  try {
    user = new User({ ...req.body });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    
    const token = user.generateAuthToken();
    const response = _.pick(user,['_id', 'name', 'email']) 
    res.header('x-auth-token', token).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;