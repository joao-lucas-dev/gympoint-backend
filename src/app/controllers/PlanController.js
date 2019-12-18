import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schemas = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schemas.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { title } = req.body;

    const plan = await Plan.findOne({ where: { title } });

    if (plan) {
      return res.status(400).json({ error: 'Plan already created' });
    }

    const { id, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }
}

export default new PlanController();
