const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticate } = require('../middleware/authMiddleware');


router.get('/', authenticate, searchController.search);
router.post('/spam', authenticate, searchController.markSpam);

module.exports = router;