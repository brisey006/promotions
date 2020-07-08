const User = require('../models/user');
const Promotion = require ('../models/promotion');
const roles = require('../config/auth').roles;

module.exports = {
    modifyPromotionPermission: async (req, res, next) => {
        const promotionAdmin = (await Promotion.findOne({ _id: req.params.id })).createdBy.toString();
        if (promotionAdmin == req.user._id || req.user.userType == roles.SUPER_USER) {
            next();
        } else {
            const error = new Error(JSON.stringify(['You do not have permissions to make these changes. You can only edit promotions that you manage.']));
            error.status = 401;
            next(error);
        }
    }
}