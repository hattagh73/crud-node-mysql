const express = require('express');
const heroControllers = require('../controller/heroControllers');
const router = express.Router();

// @route - /api/v1/bootcamps/
router
    .route('/')
    .get(heroControllers.getAllHeroes)
    .post(heroControllers.createNewHero)
    .delete(heroControllers.deleteAllHeroes);
    

// @route - /api/v1/bootcamps/someid
router
    .route('/:id')
    .get(heroControllers.getHeroById)
    .put(heroControllers.updateHeroById)
    .delete(heroControllers.deleteHeroById);

module.exports = router;