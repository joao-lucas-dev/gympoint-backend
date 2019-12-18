import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Students from '../models/Students';
import Plan from '../models/Plan';
import Registrations from '../models/Registrations';

class RegistrationsController {
  async store(req, res) {
    const schemas = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schemas.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    //
    //  Verify if student exists
    //

    const student = await Students.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    //
    //  Verify if plan exists
    //

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const { duration, price } = plan;

    const formarttedDate = parseISO(start_date);

    const endDate = addMonths(formarttedDate, duration);

    const totalPrice = price * duration;

    const register = await Registrations.create({
      student_id,
      plan_id,
      start_date: formarttedDate,
      end_date: endDate,
      price: totalPrice,
    });

    return res.json(register);
  }

  async update(req, res) {
    const schemas = Yup.object().shape({
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schemas.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id } = req.params;
    const { plan_id, start_date } = req.body;

    const register = await Registrations.findByPk(id);

    if (register.plan_id !== plan_id) {
      const checkPlan = await Plan.findOne({ where: { id: plan_id } });

      if (!checkPlan) {
        return res.status(400).json({ error: 'Plan not found' });
      }
    }

    const newPlan = await Plan.findOne({ where: { id: plan_id } });

    const { duration, price } = newPlan;

    const formarttedDate = parseISO(start_date);

    const endDate = addMonths(formarttedDate, duration);

    const totalPrice = price * duration;

    const registrations = await register.update({
      plan_id,
      start_date: formarttedDate,
      end_date: endDate,
      price: totalPrice,
    });

    return res.json(registrations);
  }
}

export default new RegistrationsController();
