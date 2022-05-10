
const express = require('express');
const Router = express();
const Controllers = require('../controllers/questions');
Router.route('/questions').post(Controllers.Add)
//Router.post('/questions', Controllers.Add)
Router.route('/questions').get(Controllers.GetAll)
Router.get('/questions/:id', Controllers.GetOne)
Router.put('/questions/:id', Controllers.UpdateOne)
Router.delete('/questions/:id', Controllers.DeleteOne)

module.exports = Router;