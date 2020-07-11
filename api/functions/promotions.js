const Promotion = require('../models/promotion');

const addBaseLinkToImages = (image) => {
    Object.keys(image).forEach(key => {
        if (typeof image[key] == 'string') {
            image[key] = `${process.env.BASE_API_URL}${image[key]}`;
        }
    });
}

const pricesAsDoubles = (prices) => {
    if (prices.length != 0) {
        return prices.map(price => {
            let was = parseFloat(price.was.toString());
            let now = parseFloat(price.now.toString());
            let newPrice = { ...price._doc, now, was };
            return newPrice;
        });
    }
    return [];
}

const processPromotion = (promotion) => {
    addBaseLinkToImages(promotion.image);
    let prices = pricesAsDoubles(promotion.prices);
    return { ...promotion._doc, prices };
}

const populateOptions = () => {
    return [
        {
            path: 'seller',
            select: ['name', 'logoUrl', 'slug', 'address', 'cell', 'email']
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
        return processPromotion(promotion);
    },
    async getPromotionBySlug(slug) {
        let promotion = await Promotion
        .findOne({ slug })
        .populate(populateOptions());
        return processPromotion(promotion);
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
            return processPromotion(promotion);
        });
        promotions.docs = docs;
        return promotions;
    },
}