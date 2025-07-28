    const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const fetch = require('node-fetch')


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
    console.log(signature)

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


// --- VERIFY PAYMENT ---
// This function has been updated with robust logging and error handling.
exports.verifyEsewaPayment = async (req, res) => {
    const successRedirectUrl = `${process.env.BASE_URL}/payment/success?status=success`;
    const failureRedirectUrl = `${process.env.BASE_URL}/payment/failure?status=failure`;

    try {
        console.log("--- eSewa Verification Started ---");
        const { data } = req.query;

        if (!data) {
            console.log("Verification failed: No data received from eSewa.");
            return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('No data received.')}`);
        }
        
        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        console.log("Step 1: Decoded Data from eSewa:", decodedData);
        
        const verificationUrl = `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${process.env.ESEWA_MERCHANT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`;
        console.log("Step 2: Performing server-to-server verification with URL:", verificationUrl);
        
        // --- ADDED ROBUST FETCH HANDLING ---
        const response = await fetch(verificationUrl);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Verification failed: eSewa API returned status ${response.status}. Response: ${errorText}`);
            throw new Error(`eSewa verification check failed. Status: ${response.status}`);
        }
        
        const verificationResponse = await response.json();
        console.log("Step 3: Response from eSewa Verification API:", verificationResponse);
        // --- END ROBUST FETCH HANDLING ---

        if (verificationResponse.status.toUpperCase() === 'COMPLETE') {
            console.log("Step 4: eSewa confirms payment is COMPLETE. Checking local database...");
            const payment = await Payment.findOne({ transaction_uuid: verificationResponse.transaction_uuid });

            if (!payment) {
                console.error(`CRITICAL: Payment record not found for UUID: ${verificationResponse.transaction_uuid}`);
                return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('Payment record not found.')}`);
            }

            if (payment.status === 'success') {
                console.log("Payment was already marked as success. Redirecting.");
                return res.redirect(successRedirectUrl);
            }

            payment.status = 'success';
            await payment.save();
            console.log(`Step 5: Payment record ${payment._id} updated to 'success'.`);

            console.log(`Step 6: Updating user ${payment.userId} with subscription plan: '${payment.plan}'`);
            const updatedUser = await User.findByIdAndUpdate(
                payment.userId, 
                { subscription: payment.plan }, // Ensure 'Pro'/'Premium' matches your User schema enum
                { new: true }
            );

            if (!updatedUser) {
                 console.error(`CRITICAL: Payment ${payment._id} succeeded but User ${payment.userId} could NOT be found or updated.`);
                 return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('Account update failed. Please contact support.')}`);
            }
            
            console.log(`Step 7: User ${updatedUser._id} subscription updated to '${updatedUser.subscription}'. Verification complete.`);
            return res.redirect(successRedirectUrl);

        } else {
            console.log(`Verification failed: eSewa status is '${verificationResponse.status}'.`);
            await Payment.findOneAndUpdate({ transaction_uuid: decodedData.transaction_uuid }, { status: 'failure' });
            return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent(`Transaction status is ${verificationResponse.status}.`)}`);
        }
        
    } catch (error) {
        console.error('--- FATAL ERROR in verifyEsewaPayment ---', error);
        return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('An internal server error occurred.')}`);
    }
};

// --- GET TRANSACTION HISTORY ---
// This function is correct and requires no changes.
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