const express=require('express');
const User = require('../models/User');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt= require('bcryptjs');
var jwt=require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser');
const JWT_SECRET='Harryisagoodb$oy'

// Route:1 create a user using POST "/api/auth/createuset". Doesn't require authentication
router.post('/createuser',[
    //using validator 
    body('name','Enter a valid name').isLength({ min: 3}),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be atleast 5 characters').isLength({ min: 5 })

  ] , async (req,res)=>{
    const errors = validationResult(req);
    //check if there is error
    if (!errors.isEmpty()) {
        //if error send error 404 and send error arrays
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user exist already
    try{
    let user=await User.findOne({email: req.body.email})
    if(user)
    {
      return res.status(400).json({error:"Sorry user exist already with this email"})
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
       user=await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(data,JWT_SECRET);
     
      res.json({authtoken})
    }
    catch(error)
    {
      console.error(error.message);
      res.status(500).send("Some error occurred")
    }
})

//Route 2: authenticate a user using POST "/api/auth/createuser". require authentication
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be Empty').exists(),
],async(req,res)=>{
  const errors=validationResult(req);
  let success=false;
  if(!errors.isEmpty())
  {
    return res.status(400).json({errors:errors.array()});
  }
  const {email,password}=req.body;
  try {
    let user= await User.findOne({email});
    if(!user)
    {
      return res.status(400).json({error:"Please try to login with correct credentials"})
    }
    const passwordCompare= await bcrypt.compare(password,user.password);
    if(!passwordCompare)
    {
      success=false;
      return res.status(400).json({success,error:"Please try to login with correct credentials"})
    }
    const data={
      user:{
        id:user.id
      }
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
    success=true
    res.json({success,authtoken})
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred")
  }

})

//Route:3 get loggedin user details using Post: "/api/auth/getuser",login required
router.post('/getuser',fetchuser,async (req,res)=>{
try {
  userId=req.user.id;
  const user=await User.findById(userId).select("-password")
  res.send(user);

} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error occurred")

}
})

module.exports=router 