const express = require('express');
const router = express.Router();
const {neon} = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
require('dotenv').config();
const verifyToken = require('../../middleware/verifyToken');
const {generatorPayment} = require('../services/paymentService');
const {registerService} = require("../services/registerService");

router.post('/', verifyToken, async (req, res) => {
    console.log("payment", req.body);
    const userId = req.userId;
    const result = await generatorPayment(userId, res);
    if(result.status >= 400) {
        return res.status(result.status).json({result})
    }
    res.json(result);

});

module.exports = router;