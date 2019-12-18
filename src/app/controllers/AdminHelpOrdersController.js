import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';

class AdminHelpOrdersController {
  async store(req, res) {
    const schemas = Yup.object().shape({
      answer: Yup.string(),
      teste: Yup.date(),
    });

    if (!(await schemas.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id } = req.params;
    const { answer, answer_at } = req.body;

    const helpOrders = await HelpOrders.findByPk(id);

    if (!helpOrders) {
      return res.status(400).json({ error: 'help order does not exists' });
    }

    const answerAdmin = await helpOrders.update({
      answer,
      answer_at,
    });

    return res.json(answerAdmin);
  }

  async index(req, res) {
    const helpOrders = await HelpOrders.findAll({
      where: { answer: null },
      attributes: ['id', 'question', 'answer'],
    });

    return res.json(helpOrders);
  }
}

export default new AdminHelpOrdersController();
