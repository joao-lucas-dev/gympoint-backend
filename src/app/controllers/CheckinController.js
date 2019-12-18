import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const { id: student_id } = req.params;

    const countCheckins = await Checkin.count({ where: { student_id } }).then(
      count => {
        return count;
      }
    );

    if (countCheckins === 5) {
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
