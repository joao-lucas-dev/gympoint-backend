import Sequelize from 'sequelize';

import databaseconfig from '../config/database';

import User from '../app/models/User';
import Students from '../app/models/Students';
import Plan from '../app/models/Plan';

const models = [User, Students, Plan];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseconfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
