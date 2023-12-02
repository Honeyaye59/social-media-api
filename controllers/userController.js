const User = require('./../models/userModel');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if(!users){
            return res.status(404).json({
                message: 'No Users Found'
            })
        }
        return res.status(200).json({
            users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

exports.signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: 'User already exists, login instead'
            })
        }
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            blogs: []
        })
        res.status(201).json({
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({
                message: 'Could not find User with this email'
            })
        }
        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: 'Incorrect Password'
            })
        }
        return res.status(200).json({
            message: 'Login Successful'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'INternal server error'
        })
    }
}