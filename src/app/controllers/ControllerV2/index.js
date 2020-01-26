/**
 * Preparando Controller para implementar Raspberry *
 */

class ApiV2 {
  async index(req, res, next) {
    return next();
  }
}

export default new ApiV2();
