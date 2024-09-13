
const express = require('express');
const { checkuserfunc } = require('../controllers/check');

const CheckRouter = express.Router();

CheckRouter.get('/checkuser',checkuserfunc)

module.exports = CheckRouter;
