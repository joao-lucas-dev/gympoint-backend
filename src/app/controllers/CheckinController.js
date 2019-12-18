import { startOfWeek, endOfWeek, subDays, addDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const { id: student_id } = req.params;

    const countCheckins = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [
            subDays(startOfWeek(new Date()), 1),
            addDays(endOfWeek(new Date()), 1),
          ],
        },
      },
    });

    if (countCheckins.count === 5) {
      return res
        .status(401)
        .json({ error: 'Student already has 5 check in in this week' });
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
