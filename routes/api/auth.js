const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require("../../middleware/auth");
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

//@route   GET api/uauth
//@desc    Test Route
//@access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');

    }
}); 

//@Route

router.post('/', [
    check('email', 'Please includ and valid email')
        .isEmail(),
    check('password', "Please enter a valid password with 6 or more charecters"
    ).exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try{
        let user = await User.findOne({ email })

        if(!user) {
            return res
            .status(400)
            .json({errors: [{ msg: "Ivaild credentials"}]});
        }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res
            .status(400)
            .json({errors: [{ msg: "Ivaild credentials"}]});
    }

   const payload = {
       user: {
           id: user.id
       }
   }
    jwt.sign(
        payload, 
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
            if(err) throw err;
            res.json({token});
        });

    } catch(err) {
        console.log(err.message);
        res.status(500).send("erver error");

    }
});

module.exports = router;