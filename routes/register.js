const express = require('express')
const router = express.Router()
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const bodyparser = require('body-parser')
router.use(bodyparser.json())

console.log('1')
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

router.post('/' , async (req,res)=>{
      const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ msg: 'Email already registered' });

    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashed });
    await user.save();

    // create token payload (small)
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    res.status(201).json({ token });
  }catch(err){
     console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
})

module.exports = router