const axios = require('axios');
const User = require('../models/userModel');
const FormData = require('form-data');

const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.userId;

        if (!userId || !prompt) {
            return res.status(400).json({
                success: false,
                message: "User ID and prompt are required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.creditBalance <= 0) {
            return res.status(403).json({
                success: false,
                message: "No credit balance. Please purchase credits to generate an image.",
                creditBalance: user.creditBalance,
            });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API,
                    ...formData.getHeaders(),
                },
                responseType: 'arraybuffer',
            }
        ); 

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        // Decrease credit balance
        user.creditBalance -= 1;
        await user.save();

        res.status(200).json({
            success: true, // ✅ This was missing
            message: "Image generated successfully",
            creditBalance: user.creditBalance,
            resultImage,
        });

    } catch (e) {
        console.error("Image generation error:", e.response?.data || e.message);
        res.status(500).json({
            success: false,
            message: "Image generation failed",
        });
    }
};


module.exports = { generateImage };
