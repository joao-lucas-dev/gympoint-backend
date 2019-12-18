import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

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

  async update(req, res) {
    const schemas = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schemas.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id } = req.params;
    const { title } = req.body;

    const plan = await Plan.findByPk(id);

    if (plan.title !== title) {
      const checkTitle = await Plan.findOne({ where: { title } });

      if (checkTitle) {
        return res.status(400).json({ error: 'Title already in use' });
      }
    }

    const { duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }
}

export default new PlanController();
