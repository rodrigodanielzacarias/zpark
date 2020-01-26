export default async (req, res, next) => {
  var dateFormat = require('dateformat');

  /**
   * Logger simples
   */
  console.dir(
    `/Middleware/logger ${dateFormat(new Date(), 'dd/mm/yyyy HH:MM:ss')} ${
      res.connection.remoteAddress
    } ${req.method} ${req.url}`
  );

  return next();
};
