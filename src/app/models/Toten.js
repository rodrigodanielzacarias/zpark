import Sequelize, { Model } from 'sequelize';

class Toten extends Model {
  static init(sequelize) {
    super.init(
      {
        host: Sequelize.STRING,
        pin: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Toten;
