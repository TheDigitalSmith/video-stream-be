const express = require("express");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express.Router();
const { User, validateUser } = require("../../schema/user");

router.get('/', async(req,res)=>{
    const users = await User.find({});
    res.send(users)
})

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send('User already registered');

  try {
    user = new User({ ...req.body });
    const salt = await bcrypt.genSalt(10);
    user.password = bcrypt.hash(user.password, salt);
    await user.save();
    
    const response = _.pick(user,['_id', 'name', 'email']) 
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;