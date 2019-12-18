import Sequelize, { Model } from 'sequelize';
import bcriptjs from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }

  checkPassword(password) {
    return bcriptjs.compare(password, this.password_hash);
  }
}

export default User;
