import * as Yup from 'yup';
import { addMonths, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Students from '../models/Students';
import Plan from '../models/Plan';
import Registrations from '../models/Registrations';

import Mail from '../../lib/Mail';

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

    await Mail.sendEmail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem-vindo a GymPoint',
      template: 'welcome',
      context: {
        user: student.name,
        startDate: format(formarttedDate, "dd'/'MM'/'yyyy", { locale: pt }),
        plan: plan.title,
        month: plan.duration,
        endDate: format(endDate, "dd'/'MM'/'yyyy", { locale: pt }),
        price: totalPrice,
      },
    });

    return res.json(register);
  }

  async index(req, res) {
    const registrations = await Registrations.findAll({
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
      ],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email', 'age', 'weight', 'height'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration'],
        },
      ],
    });

    return res.json(registrations);
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

    const register = await Registrations.findByPk(id, {
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (register.plan_id !== plan_id) {
      const checkPlan = await Plan.findOne({ where: { id: plan_id } });

      if (!checkPlan) {
        return res.status(400).json({ error: 'Plan not found' });
      }
    }

    const newPlan = await Plan.findOne({ where: { id: plan_id } });

    const { title, duration, price } = newPlan;

    const formarttedDate = parseISO(start_date);

    const endDate = addMonths(formarttedDate, duration);

    const totalPrice = price * duration;

    const registrations = await register.update({
      plan_id,
      start_date: formarttedDate,
      end_date: endDate,
      price: totalPrice,
    });

    await Mail.sendEmail({
      to: `${register.student.name} <${register.student.email}>`,
      subject: 'Seu plano mudou!',
      template: 'updatePlan',
      context: {
        user: register.student.name,
        startDate: format(formarttedDate, "dd'/'MM'/'yyyy", { locale: pt }),
        plan: title,
        month: duration,
        endDate: format(endDate, "dd'/'MM'/'yyyy", { locale: pt }),
        price: totalPrice,
      },
    });

    return res.json(registrations);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Registrations.destroy({ where: { id } });

    return res.json();
  }
}

export default new RegistrationsController();
