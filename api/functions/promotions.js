const Promotion = require('../models/promotion');

const pricesAsDoubles = (promotion) => {
    if (promotion.prices.length != 0) {
        let prices = promotion.prices.map(price => {
            let was = parseFloat(price.was.toString());
            let now = parseFloat(price.now.toString());
            let newPrice = { ...price._doc, now, was };
            return newPrice;
        });
        return { ...promotion._doc, prices };
    }
    return promotion;
}

const populateOptions = () => {
    return [
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
    ];
}

module.exports = {
    async getPromotionById(id) {
        let promotion = await Promotion
        .findOne({ _id: id })
        .populate(populateOptions());
        return pricesAsDoubles(promotion);
    },
    async getPromotionBySlug(slug) {
        let promotion = await Promotion
        .findOne({ slug })
        .populate(populateOptions());
        return pricesAsDoubles(promotion);
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
                populate: populateOptions()
            }
        );
        const docs = promotions.docs.map(promotion => {
            return pricesAsDoubles(promotion);
        });
        promotions.docs = docs;
        return promotions;
    },
}