const express = require('express')
const {generateImage} = require('../controllers/imageController')
const { userAuth } = require('../middleware/auth')

const router = express.Router()

router.post('/generate-image',userAuth,generateImage)

module.exports = router;