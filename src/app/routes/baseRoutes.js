const BaseController = require('../controllers/baseController');
const baseController = new BaseController();

module.exports = (app) => {

    const routesBase = BaseController.routes();

    app.get(routesBase.home, baseController.home());

    app.route(routesBase.login)
        .get(baseController.login())
        .post(baseController.efetuarLogin());
};