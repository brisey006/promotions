const Promotion = require('../models/promotion');

module.exports = {
    async getPromotion(id) {
        let updated = await Promotion
        .findOne({ _id: id })
        .populate([
            {
                path: 'seller',
                select: ['name', 'logoUrl', 'slug']
            },
            {
                path: 'tags',
                select: ['name']
            },
            {
                path: 'prices.currency',
                select: ['acronym', 'name', 'symbol']
            }
        ]);
        return updated;
    },
    async getPromotions(req, user) {
        const page = req.query.page != undefined ? req.query.page : 1;
        const limit = req.query.limit != undefined ? req.query.limit : 10;
        const query = req.query.query != undefined ? req.query.query : '';
        const sortBy = req.query.sort != undefined ? req.query.sort : 'createdAt';
        const order = req.query.order != undefined ? req.query.order : -1;

        const re = new RegExp(query, "gi");

        let filters = {
            title: re,
            active: true
        };

        if (user != null) {
            delete filters.active;
        }

        let promotions = await Promotion.paginate(
            filters,
            {
                limit,
                sort: { [sortBy]: order },
                page,
                populate: [
                    {
                        path: 'seller',
                        select: ['name', 'logoUrl', 'slug']
                    },
                    {
                        path: 'tags',
                        select: ['name']
                    },
                    {
                        path: 'prices.currency',
                        select: [ 'name', 'acronym', 'symbol' ]
                    }
                ]
            }
        );
        return promotions;
    }
}