const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const razorpay = require('razorpay')
const Transaction = require('../models/transactionModel')

const registerUser = async(req,res) => {
    try{
        const{name,email,password} = req.body

        const checkExistingUser = await User.findOne({$or : [{name}, {email}]})
        if(checkExistingUser){
            return res.status(404).json({
                message:"User already exits"
            })
        }
        if(!name || !email || !password){
            return res.json({
                message:"All the fields should be filled"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = await User.create({
            name,
            email,
            password:hashedPassword
        })
        if(newUser){
            const accessToken = jwt.sign(
                { userId: newUser._id, userName: newUser.name },
                process.env.JWT_SECRET
            );

            res.status(200).json({
                success: true,
                message: "User registered successfully",
                accessToken,
                user: {
                name: newUser.name,
                email: newUser.email,
                },
            });

        } else{
            res.status(404).json({
                message:"Unable to create user"
            })
        }

    } catch(e){
        console.log(e);
        
    }
}

const LoginUser = async(req,res) => {
    try{
        const {email,password} = req.body

    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({
            message:"Invalid credencials"
        })
    }


    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
        return res.status(404).json({
            message:"Invalid credencials"
        })
    }


    const accessToken = jwt.sign({
        userId:user._id,
        userName : user.name
    },
    process.env.JWT_SECRET)
    res.status(200).json({
    success: true,
    message: "User logged in successfully",
    accessToken,
    user: {
      name: user.name,
      email: user.email,
    },
});

    } catch(e){
        console.log(e);
        
    }    
}



const userCredits = async (req, res) => {
    try {
        const userId = req.userId; // ✅ from middleware

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            credit: user.creditBalance,
            user: {
                name: user.name,
                email: user.email
            }
            });

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server Error" });
    }
};


const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
});
const paymentRazorpay = async(req,res) => {
    try{
        const {userId,planId} = req.body;
        const userData = await User.findById(userId)
        if (!userId || !planId) {
            return res.status(400).json({
                success: false,
                message: "Missing userId or planId"
            });
        }


        let credits,plan,amount,date

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;
        
            default:
                return res.status(404).json({
            success:false,
            message:"Plan not found"
        })
        }

        date = Date.now();

        const transactiondata = {
            userId,plan,amount,credits,date
        }

        const newTransaction = await Transaction.create(transactiondata)


        const options = {
            amount : amount * 100,
            currency:process.env.CURRENCY,
            receipt : newTransaction._id
        }

        await razorpayInstance.orders.create(options,(error,order) => {
            if(error){
                console.log(error);
                return res.json({
                    success:false,
                    message:error
                })
                
            }
            res.status(200).json({
                success:true,
                order
            })
        })
    } catch(e){
        console.log(e);
        res.status(404).json({
            success:false,
            message:e.message
        })
        
    }
}


const verifyRazorpay = async(req,res) => {
    try{
        const {razorpay_order_id} = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid'){
            const transactiondata = await Transaction.findById(orderInfo.receipt)
            if(transactiondata.payment){
                return res.json({
                    success:false,
                    message:"payment failed"
                })
            }

            const userData = await User.findById(transactiondata.userId)
            const creditBalance = userData.creditBalance + transactiondata.credits
            await User.findByIdAndUpdate(userData._id,{creditBalance})

            await Transaction.findByIdAndUpdate(transactiondata._id,{payment:true})

            res.json({
                success:true,
                message:"Credits added"
            })
        } else{
            res.json({
                success:false,
                message:"Payment Failed"
            })
        }
    } catch(error){
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
        
    }
}

module.exports = {registerUser,LoginUser,userCredits,paymentRazorpay,verifyRazorpay}