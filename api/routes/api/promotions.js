const express = require('express');
const router = express.Router();
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const verifyUser = require('../../config/auth').verifyUser;
const slugify = require('../../functions/index').slugify;
const imageSettings = require('../../data/image-settings');
const userRoles = require('../../config/auth').roles;

const { getPromotion, getPromotions } = require('../../functions/promotions');

const Promotion = require('../../models/promotion');
const Tag = require('../../models/tag');
const Seller = require('../../models/seller');
const ImageUploadSetting = require('../../models/image-upload-setting');
const { modifyPromotionPermission } = require('../../permissions/promotions');
const Currency = require('../../models/currency');

router.post('/', verifyUser, async (req, res, next) => {
    try {
        const { title, description, seller, tagsArray, expiry } = req.body;
        const createdBy = req.user._id;
        const errors = [];

        if (!title) {
            errors.push('Promotion title is required.');
        }

        if (!seller) {
            errors.push('Seller is required.');
        }

        if (!expiry) {
            errors.push('Promotion expiry date required.');
        }

        if (errors.length == 0) {
            const sellerInfo = await Seller.findOne({ _id: seller }).select('name');
            const slug = slugify(`${sellerInfo.name} ${title}`);

            const tags = [];
            if (tagsArray.length > 0) {
                for (let i = 0; i < tagsArray.length; i++) {
                    const name = tagsArray[i].toLowerCase();
                    const tag = await Tag.findOne({ name });

                    if (tag) {
                        tags.push(tag._id);
                    } else {
                        const newTag = new Tag({ name });
                        await newTag.save();
                        tags.push(newTag._id);
                    }
                }
            }
            const promotion = new Promotion({ title, description, seller, slug, tags, createdBy, expiry });
            await promotion.save();
            res.json(promotion);
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

router.post('/:id/add-price', async (req, res, next) => {
    try {
        const { currency, was, now } = req.body;
        const errors = [];

        if (!currency) {
            errors.push('Currency is required.');
        }
        if (!was) {
            errors.push('Previous price is required.');
        }
        if (!now) {
            errors.push('Current price is required');
        }

        const currencyObj = await Currency.findOne({ _id: currency });
        const promotion = await Promotion.findOne({ _id: req.params.id });

        if (!currencyObj) {
            errors.push('Currency you provided is not available.');
        }

        const filteredArray = promotion.prices.filter(e => {
            return currencyObj.acronym == e.key;
        });

        if (filteredArray.length > 0) {
            errors.push(`Price in ${currencyObj.name} already added.`);
        }

        if (errors.length == 0) {
            
            const price = {
                currency: currencyObj,
                key: currencyObj.acronym,
                was,
                now
            };
            promotion.prices.push(price);
            await promotion.save();
            const updated = await getPromotion(promotion._id);
            res.json(updated);
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

router.put('/:id/activate', async (req, res, next) => {
    try {
        let { active } = req.body;
        active = !active ? false : active;
        const errors = [];
        const promotion = await Promotion.findOne({ _id: req.params.id });

        if (promotion.image == null) {
            errors.push('Add promotion image before you activate this promotion.');
        }
        if (promotion.prices.length == 0) {
            errors.push('Add promotion price(s) before you activate this promotion.');
        }
        
        if (errors.length == 0) {
            promotion.active = active;
            await promotion.save();
            const updated = await getPromotion(promotion._id);
            res.json(updated);
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

router.delete('/:id/delete-price', verifyUser, modifyPromotionPermission, async (req, res, next) => {
    try {
        const { id } = req.query;
        const promotion = await Promotion.findOne({ _id: req.params.id });

        const filteredArray = promotion.prices.filter(e => {
            return id != e._id.toString();
        });

        promotion.prices = filteredArray;
        if (promotion.prices.length == 0) {
            promotion.active = false;
        }
        
        await promotion.save();
        let updated = await getPromotion(promotion._id);
        res.json(updated);
    } catch (e) {
        const error = new Error(JSON.stringify([e.message]));
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const promotions = await getPromotions(req, null);
        res.json(promotions);
    } catch (e) {
        const error = new Error(JSON.stringify([e.message]));
        next(error);
    }
});

router.get('/admin/list', verifyUser, async (req, res, next) => {
    try {
        const promotions = await getPromotions(req, req.user);
        res.json(promotions);
    } catch (e) {
        const error = new Error(JSON.stringify([e.message]));
        next(error);
    }
});

router.get('/seller/:seller', async (req, res, next) => {
    const page = req.query.page != undefined ? req.query.page : 1;
    const limit = req.query.limit != undefined ? req.query.limit : 20;

    const seller = await Seller.findOne({ slug: req.params.seller });

    let promotions = await Promotion.paginate(
        { seller: seller._id },
        {
            limit,
            page,
            populate: [
                {
                    path: 'seller',
                    select: ['name', 'logoUrl']
                },
                {
                    path: 'tags',
                    select: ['name']
                }
            ]
        }
    );
    res.json(promotions);
});

router.get('/search', async (req, res, next) => {
    const page = req.query.page != undefined ? req.query.page : 1;
    const limit = req.query.limit != undefined ? req.query.limit : 20;
    const query = req.query.query;

    const re = new RegExp(query, "gi");

    let promotions = await Promotion.paginate(
        { title: re },
        {
            limit,
            page,
            populate: [
                {
                    path: 'seller',
                    select: ['name', 'logoUrl']
                },
                {
                    path: 'tags',
                    select: ['name']
                }
            ]
        }
    );
    res.json(promotions);
});

router.get('/:slug', async (req, res, next) => {
    let promotion = await Promotion
        .findOne({ slug: req.params.slug })
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
    res.json(promotion);
});

router.delete('/:id', verifyUser, modifyPromotionPermission, async (req, res) => {
    try {
        const data = await Promotion.findOne({  _id: req.params.id });
        let result = await Promotion.deleteOne({ _id: req.params.id });
        if (result.deletedCount == 1) {
            const publicDir = req.app.locals.publicDir;
            Object.values(data.image).forEach(loc => {
                if ((typeof loc) == 'string') {
                    if (loc.indexOf('uploads') > -1) {
                        fs.unlinkSync(path.join(publicDir, loc));
                    }
                }
            });
            res.json(data);
        } else {
            const error = new Error(JSON.stringify(['Promotion not found']));
            error.status = 404;
            next(error);
        }
    } catch (e) {
        const error = new Error(JSON.stringify([e.message]));
        next(error);
    }
});

router.put('/:id', verifyUser, async (req, res, next) => {
    try {
        const id = req.params.id;
        const { tagsArray } = req.body;
        const tags = [];

        if (tagsArray) {
            if (tagsArray.length > 0) {
                for (let i = 0; i < tagsArray.length; i++) {
                    const name = tagsArray[i].toLowerCase();
                    const tag = await Tag.findOne({ name });
    
                    if (tag) {
                        tags.push(tag._id);
                    } else {
                        const newTag = new Tag({ name });
                        await newTag.save();
                        tags.push(newTag._id);
                    }
                }
            }
        }

        const result = await Promotion.updateOne({ _id: id }, { $set: { tags, ...req.body } });
        if (result.nModified == 1) {
            let promotion = await Promotion
            .findOne({ _id: id })
            .populate([
                {
                    path: 'seller',
                    select: ['name', 'logoUrl', 'slug']
                },
                {
                    path: 'tags',
                    select: ['name']
                }
            ]);
            res.json(promotion);
        } else {
            const errors = ['Promotion failed to update. Please try again later!'];
            const error = new Error(JSON.stringify(errors));
            error.status = 406;
            next(error);
        }
    } catch (e) {
        const error = new Error(JSON.stringify([e.message]));
        next(error);
    }
});

router.post('/:id/image', verifyUser, async (req, res, next) => {
    try {
        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
        }
    
        const settings = await ImageUploadSetting.findOne({ slug: imageSettings.PROMOTIONS.key });
        const promotion = await Promotion.findOne({ _id: req.params.id });
        
        let file = req.files.file;
        let fileName = req.files.file.name;
        let ext = path.extname(fileName);
    
        let dateTime = new Date(promotion.createdAt);
    
        const fileN = `${slugify(promotion.slug+" "+dateTime.getTime().toString())}${ext}`;
    
        let finalFile = `${settings.originalPath}/${fileN}`;
    
        const publicDir = req.app.locals.publicDir;
        
        file.mv(path.join(publicDir, finalFile), async (err) => {
        if (err){
            const error = new Error(JSON.stringify([err.message]));
            next(error);
        } else {
            promotion.image.original = finalFile;
            await promotion.save();
            res.json({ status: 'picture uploaded' });
        }
        });
    } catch (e) {
        const error = new Error(JSON.stringify([e.message]));
        next(error);
    }
});

router.post('/:id/image/crop', async (req, res, next) => {
    try {
        sharp.cache(false);
        let { width, height, x, y } = req.body;
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        const settings = await ImageUploadSetting.findOne({ slug: imageSettings.PROMOTIONS.key });
        const promotion = await Promotion.findOne({ _id: req.params.id });

        let ext = '.jpg';
        let dateTime = new Date(promotion.createdAt);
        const fileN = `${slugify(promotion.slug+" "+dateTime.getTime().toString())}${ext}`;
        let finalFile = `${settings.thumbnailsPath}/${fileN}`;
        let finalFile2 = `${settings.croppedPath}/${fileN}`;

        const publicDir = req.app.locals.publicDir;

        const image = sharp(path.join(publicDir, promotion.image.original));
        image.metadata().then((metadata) => {
            const thumbWidth = settings.thumbnailWidth;
            const thumbHeight = (thumbWidth / settings.aspectRatio[0]) * settings.aspectRatio[1];
        return image
                .extract({ left: parseInt(x, 10), top: parseInt(y, 10), width: parseInt(width, 10), height: parseInt(height, 10) })
                .resize(parseInt(thumbWidth, 10), parseInt(thumbHeight, 10))
                .webp()
                .toBuffer();
        })
        .then(data => {
            fs.writeFile(path.join(publicDir, finalFile), data, async (err) => {
                if(err) {
                    const error = new Error(JSON.stringify([err.message]));
                    next(error);
                }
                promotion.image.thumbnail = finalFile;
                await promotion.save();
                
                
                const image2 = sharp(path.join(publicDir, promotion.image.original));
                image2.metadata()
                    .then((metadata) => {
                        const croppedWidth = settings.croppedWidth;
                        const croppedHeight = (croppedWidth / settings.aspectRatio[0]) * settings.aspectRatio[1];
                    return image2
                            .extract({ left: parseInt(x, 10), top: parseInt(y, 10), width: parseInt(width, 10), height: parseInt(height, 10) })
                            .resize(parseInt(croppedWidth, 10), parseInt(croppedHeight, 10))
                            .webp()
                            .toBuffer();
                    })
                    .then(data => {
                        fs.writeFile(path.join(publicDir, finalFile2), data, async (err) => {
                            if(err) {
                                const error = new Error(JSON.stringify([err.message]));
                                next(error);
                            }
                            promotion.image.cropped = finalFile2;
                            await promotion.save();
                            res.json(promotion);
                        });
                    }).catch(err => {
                        const error = new Error(JSON.stringify([err.message]));
                        next(error);
                    });
                });
            }).catch(err => {
                const error = new Error(JSON.stringify([err.message]));
                next(error);
            });
    } catch (e) {
        const error = new Error(JSON.stringify([e.message]));
        next(error);
    }
});

module.exports = router;