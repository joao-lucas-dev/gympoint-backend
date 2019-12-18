import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';

class UserHelpOrdersController {
  async store(req, res) {
    const schemas = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schemas.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id } = req.params;
    const { question } = req.body;

    //
    //  Verify if student exists
    //

    const student = await Students.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const questionUser = await HelpOrders.create({
      student_id: id,
      question,
    });

    return res.json(questionUser);
  }

  async index(req, res) {
    const { id: student_id } = req.params;

    const helpOrders = await HelpOrders.findAll({
      where: { student_id },
      attributes: ['id', 'question', 'answer'],
    });

    return res.json(helpOrders);
  }
}

export default new UserHelpOrdersController();
