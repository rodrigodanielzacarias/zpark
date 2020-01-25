import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import Checkin from '../app/models/Checkin';
import Toten from '../app/models/Toten';
import TotenParam from '../app/models/TotenParam';

import databaseConfig from '../config/database';

const models = [User, File, Appointment, Checkin, Toten, TotenParam];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();

//var Bar = sequelize.define('Bar', { /* bla */ }, {
// don't add the timestamp attributes (updatedAt, createdAt)
//timestamps: false,

// don't delete database entries but set the newly added attribute deletedAt
// to the current date (when deletion was done). paranoid will only work if
// timestamps are enabled
//paranoid: true,

// don't use camelcase for automatically added attributes but underscore style
// so updatedAt will be updated_at
//underscored: true,

// disable the modification of tablenames; By default, sequelize will automatically
// transform all passed model names (first parameter of define) into plural.
// if you don't want that, set the following
//freezeTableName: true,

// define the table's name
//tableName: 'my_very_custom_table_name'
//})
