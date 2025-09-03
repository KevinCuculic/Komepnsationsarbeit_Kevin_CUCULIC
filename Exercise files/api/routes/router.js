const { Router } = require('express');
const controller = require('../controllers/controller');

const routes = Router();

/**
 * You can adapt the generic paths used in the API to fit the object
 * you are using, e.g., if you use an Animal class, all the paths
 * might start with '/animals'.
 */
const BASE = '/cars'; // <— früher '/resources'
routes.get(BASE, controller.getAll);
routes.post(BASE, controller.create);
routes.put(`${BASE}/:id`, controller.update);
routes.delete(`${BASE}/:id`, controller.delete);

module.exports = routes;