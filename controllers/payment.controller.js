const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const fetch = require('node-fetch');

// initiateEsewaPayment function remains the same...
exports.initiateEsewaPayment = async (req, res) => {
  try {
    const { plan, amount } = req.body;
    const userId = req.user._id;

    if (!plan || !amount) {
      return res.status(400).json({ success: false, message: 'Plan and amount are required.' });
    }

    const transaction_uuid = uuidv4();
    const newPayment = new Payment({ userId, plan, amount, transaction_uuid, status: 'pending' });
    await newPayment.save();

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_MERCHANT_CODE}`;
    const signature = crypto.HmacSHA256(message, secretKey).toString(crypto.enc.Base64);

    const esewaData = {
      amount: amount.toString(),
      failure_url: `${process.env.BASE_URL}/payment/failure`,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: process.env.ESEWA_MERCHANT_CODE,
      signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: `${process.env.API_URL}/payment/verify`,
      tax_amount: "0",
      total_amount: amount.toString(),
      transaction_uuid,
    };

    return res.status(200).json({ success: true, message: 'eSewa payment initiated', data: esewaData });
  } catch (error) {
    console.error("eSewa initiation error:", error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};


exports.verifyEsewaPayment = async (req, res) => {
    const successRedirectUrl = `${process.env.BASE_URL}/payment/success?status=success`;
    const failureRedirectUrl = `${process.env.BASE_URL}/payment/failure?status=failure`;

    try {
        const { data } = req.query;
        if (!data) return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('No data received.')}`);
        
        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        
        const verificationUrl = `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${process.env.ESEWA_MERCHANT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`;
        
        const response = await fetch(verificationUrl);
        if (!response.ok) throw new Error(`eSewa verification check failed. Status: ${response.status}`);
        
        const verificationResponse = await response.json();

        if (verificationResponse.status.toUpperCase() === 'COMPLETE') {
            const payment = await Payment.findOne({ transaction_uuid: verificationResponse.transaction_uuid });
            if (!payment) return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('Payment record not found.')}`);
            if (payment.status === 'success') return res.redirect(successRedirectUrl);

            payment.status = 'success';
            await payment.save();

            // --- SET EXPIRATION DATE ON SUCCESS ---
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 1); // Subscription lasts for 1 month

            const updatedUser = await User.findByIdAndUpdate(
                payment.userId, 
                { 
                    subscription: payment.plan,
                    subscriptionExpiresAt: expirationDate
                },
                { new: true }
            );

            if (!updatedUser) return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('Account update failed.')}`);
            
            return res.redirect(successRedirectUrl);
        } else {
            await Payment.findOneAndUpdate({ transaction_uuid: decodedData.transaction_uuid }, { status: 'failure' });
            return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent(`Transaction status is ${verificationResponse.status}.`)}`);
        }
    } catch (error) {
        console.error('--- FATAL ERROR in verifyEsewaPayment ---', error);
        return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('An internal server error occurred.')}`);
    }
};

// getTransactionHistory and getAllTransactionHistory remain the same...
exports.getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const payments = await Payment.find({ userId, status: 'success' }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: payments });
    } catch (error) {
        console.error("Get transaction history error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getAllTransactionHistory = async (req, res) => {
    try {
        const allTransactions = await Payment.find({})
        .populate('userId' , 'name email')
        .sort({ createdAt: -1}) ;

        return res.status(200).json({
            success : true ,
            data : allTransactions
        }) ;

    }
    catch(error) {
        console.error('Get transaction history error ', error);
        return res.status(500).json({
            success : false ,
            message : "Server error"
        })
    }
}