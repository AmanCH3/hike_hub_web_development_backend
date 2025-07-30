const User = require('../models/user.model');

// This function handles the user's request to cancel their subscription.
exports.cancelSubscription = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the user and update their subscription status.
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                subscription: 'Basic', // Revert to the free plan
                subscriptionExpiresAt: null, // Clear the expiration date
            },
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Subscription successfully cancelled.',
            data: updatedUser,
        });

    } catch (error) {
        console.error("Subscription cancellation error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};