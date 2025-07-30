// middlewares/subscription.middleware.js
const User = require('../models/user.model');

const checkSubscriptionStatus = async (req, res, next) => {
    // We only need to check if a user is logged in
    if (!req.user) {
        return next();
    }

    const user = req.user;

    // Check if there is an expiration date and if it's in the past
    if (user.subscriptionExpiresAt && new Date() > new Date(user.subscriptionExpiresAt)) {
        try {
            // Find the user in the database to update them
            const userToUpdate = await User.findById(user._id);
            if (userToUpdate) {
                userToUpdate.subscription = 'Basic';
                userToUpdate.subscriptionExpiresAt = null; // Clear the date
                await userToUpdate.save();
                
                // IMPORTANT: Update the req.user object for the current request
                req.user.subscription = 'Basic';
                req.user.subscriptionExpiresAt = null;
            }
        } catch (error) {
            console.error(`Failed to downgrade user ${user._id}:`, error);
            // Don't block the request, just log the error
        }
    }

    next();
};

module.exports = { checkSubscriptionStatus };