require('dotenv').config();
const axios = require('axios');
const User = require('../models/user.model');
const SolarPackage = require('../models/solarpackages.model');

const generatePaymentLink = async (email, packageName, amount, txRef) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const response = await axios.post(
            'https://api.flutterwave.com/v3/payments',
            {
                tx_ref: txRef,
                amount: amount,
                currency: 'NGN',
                redirect_url: 'https://lumobackend.onrender.com', //frontend confirmation url
                customer: {
                    email: user.email,
                    name: user.name,
                    phonenumber: user.phone
                },
                customizations: {
                    title: 'LumoGrid Payment',
                    description: `Payment for ${packageName} || Solar Package`,
                    //logo: 'https://res.cloudinary.com/dwx1tdonc/image/upload/v1745532815/ChatGPT_Image_Apr_24_2025_11_10_53_PM_ktlsmn.png',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Payment link generated:', response.data.data.link);
        return response.data.data.link;
    } catch (err) {
        console.error('Error generating payment link:', err.response?.data || err.message);
        throw err;
    }
};

module.exports = { generatePaymentLink };