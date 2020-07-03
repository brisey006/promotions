const User = require('../models/user');
const Seller = require ('../models/seller');
const roles = require('../config/auth').roles;

module.exports = {
    modifySellerPermission: async (req, res, next) => {
        const sellerAdmin = (await Seller.findOne({ _id: req.params.id })).administrator.toString();
        if (sellerAdmin == req.user._id || req.user.userType == roles.SUPER_USER) {
            next();
        } else {
            const error = new Error(JSON.stringify(['You do not have permissions to make these changes. You can only edit pages that you manage.']));
            error.status = 401;
            next(error);
        }
    }
}