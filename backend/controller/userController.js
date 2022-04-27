require('dotenv').config();
const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require ('jsonwebtoken');

const DaftarUser = async (req, res) =>{
    const {username, email, password} = req.body
    
    let usernameUser = await User.findOne({username: username})
    let emailUser = await User.findOne({email: email})

    if(usernameUser){
        return res.status(404).json({
            status: false,
            message: 'username sudah tersedia'

        })
    }

    
    if(emailUser){
        return res.status(404).json({
            status: false,
            message: 'email sudah tersedia'
        })
    }
    
    // API
    // const data = {
    //     usernmae: username,
    //     email: email,
    //     password: password,
    // }
    const hashPassword = await bcryptjs.hash(password, 10);
    const user = new User({
        username: username ,
        email : email ,
        password: hashPassword,
    })
    user.save()

    return res.status(201).json({
        status: true,
        message: 'User Berhasil di daftarkan',
        // data:data
    })
}

const LoginUser = async (req, res) => {
    const {username, password} = req.body
    // menggunakan or untuk mengecek user apakah login dengan menggunakan username atau email
    const datauser = await User.findOne({$or: [{username: username}, {email: username}] })
    // console.log(datauser);
    if(datauser){
        // Jika username nya ada masuk proses ini
        const passwordUser = await bcryptjs.compare(password, datauser.password)
        if(passwordUser){
            // Jika passwordnya ada masuk proses ini
            const data = {
                id : datauser._id
            }
            const token = await jsonwebtoken.sign(data, process.env.JWT_SECRET)
            return res.status(200).json({
                message: 'Berhasil Login',
                token : token,
                // username:username,
                // password: password,
            })
        }else {
            return res.status(404).json({
                status: false,
                message: 'Password salah',
            })
        }
    }else{
        return res.status(404).json({
            status: false,
            message: 'Username atau email salah',
        })
    }
}

const getSingleUser = async (req, res) => {
    const user = await User.findOne({_id: req.id})
    return res.status(200).json({
        message : 'berhasil di panggil',
        data: user
    })
}

module.exports = {
    DaftarUser,
    LoginUser,
    getSingleUser,
}

