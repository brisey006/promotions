const express = require('express');
const router = express.Router();

router.use('/currencies', require('./currencies'));
router.use('/image', require('./image-upload-settings'));

module.exports = router;

