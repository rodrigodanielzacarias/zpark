import Sequelize, { Model } from 'sequelize';

class TotensParams extends Model {
  static init(sequelize) {
    super.init(
      {
        host_id: Sequelize.INTEGER,
        param: Sequelize.STRING,
        value: Sequelize.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Toten, { foreignKey: 'host_id', as: 'host' });
  }
}

export default TotensParams;
