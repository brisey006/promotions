const express = require('express');
const router = express.Router();

const verifyUser = require('../../../config/auth').verifyUser;
const isSuperUser = require('../../../config/auth').isSuperUser;

const Currency = require('../../../models/currency');

router.post('/', verifyUser, isSuperUser, async (req, res, next) => {
    try {
        const { acronym, name, symbol } = req.body;
        const userId = req.user._id;
        const errors = [];

        if (!acronym) {
            errors.push('Currency acronym is required. e.g. USD.');
        }

        if (!name) {
            errors.push('Currency name is required. e.g. US Dollar');
        }

        if (!symbol) {
            errors.push('Currency symbol is required. e.g. $');
        }
        
        if (errors.length == 0) {
            const currency = new Currency({ acronym, name, symbol, createdBy: userId });
            await currency.save();
            res.json(currency);
        } else {
            const error = new Error(JSON.stringify(errors));
            error.status = 406;
            next(error);
        }

    } catch (e) {
        const error = new Error(JSON.stringify([e.message]));
        next(error);
    }
});

router.get('/', verifyUser, async (req, res) => {
    const page = req.query.page != undefined ? req.query.page : 1;
    const limit = req.query.limit != undefined ? req.query.limit : 10;
    const query = req.query.query != undefined ? req.query.query : '';
    const sortBy = req.query.sort != undefined ? req.query.sort : 'createdAt';
    const order = req.query.order != undefined ? req.query.order : -1;

    const re = new RegExp(query, "gi");

    let currencies = await Currency.paginate(
        { name: re },
        {
            limit,
            page,
            sort: { [sortBy]: order },
        }
    );
    res.json(currencies);
});

router.delete('/:id', verifyUser, isSuperUser, async (req, res) => {
    try {
        const data = await Currency.findOne({  _id: req.params.id });
        let result = await Currency.deleteOne({ _id: req.params.id });
        if (result.deletedCount == 1) {
            res.json(data);
        } else {
            const error = new Error(JSON.stringify(['Currency not found']));
            error.status = 404;
            next(error);
        }
    } catch (e) {
        const error = new Error(JSON.stringify([e.message]));
        next(error);
    }
});

module.exports = router;