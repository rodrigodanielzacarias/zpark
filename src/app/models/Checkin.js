import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {
        created_at: Sequelize.DATE, //Datetime chegada
        updated_at: Sequelize.DATE,
        checkin_at: Sequelize.DATE, //Datetime checkin finalizado
        checkout_at: Sequelize.DATE, //Datetime checkout finalizado
        host: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Checkin;
