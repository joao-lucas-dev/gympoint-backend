import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const student = await Students.findOne({ where: { email } });

    if (student) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, age, weight, height } = await Students.create(req.body);

    return res.json({
      user: {
        id,
        name,
        email,
        age,
        weight,
        height,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      oldEmail: Yup.string()
        .email()
        .required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { oldEmail } = req.body;

    const student = await Students.findOne({ where: { email: oldEmail } });

    if (student) {
      const { id, name, email, age, weight, height } = await student.update(
        req.body
      );

      return res.json({
        user: {
          id,
          name,
          email,
          age,
          weight,
          height,
        },
      });
    }

    return res.status(400).json({ error: 'Old e-mail not found' });
  }
}

export default new StudentsController();
