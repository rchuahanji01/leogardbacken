const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bodyparser = require('body-parser')
router.use(bodyparser.json())

router.post('/' , async (req,res)=>{
    try{
         const{email, password }= req.body
          const errors = validationResult(req);
           if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

           const user = await User.findOne({email})
        //    console.log(user)
           if(!user){
              return res.status(400).json({errors:`no user found for this ${email}`})
           }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

            const payload = { userId: user._id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

            res.json({ token });


    }catch(err){
         res.status(500).json({ msg: 'Server error' });
         console.log(err)
    }
})

module.exports = router