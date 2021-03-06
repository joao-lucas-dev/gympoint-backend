import Sequelize from 'sequelize';

import databaseconfig from '../config/database';

import User from '../app/models/User';
import Students from '../app/models/Students';
import Plan from '../app/models/Plan';
import Registrations from '../app/models/Registrations';
import Checkin from '../app/models/Checkin';
import HelpOrders from '../app/models/HelpOrders';

const models = [User, Students, Plan, Registrations, Checkin, HelpOrders];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseconfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
