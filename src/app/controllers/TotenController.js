import Toten from '../models/Toten';
import * as Yup from 'yup';

class TotenController {
  async index(req, res) {
    const result = await Toten.findAll({
      attributes: ['id', 'host', 'pin'],
    });
    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      host: Yup.string().required(),
      pin: Yup.string()
        .required()
        .min(4),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const totenExist = await Toten.findOne({
      where: { host: req.body.host },
    });
    if (totenExist) {
      return res.status(400).json({ error: 'Toten already exists' });
    }

    const { id, host } = await Toten.create(req.body);

    return res.json({ id, host });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      host: Yup.string(),
      oldPin: Yup.string().min(4),
      pin: Yup.string()
        .min(4)
        .when('oldPin', (oldPin, field) => (oldPin ? field.required() : field)),
      confirmPin: Yup.string().when('pin', (pin, field) =>
        pin ? field.required().oneOf([Yup.ref('pin')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const toten = await Toten.findOne({
      where: { host: req.body.host },
    });

    if (!toten) {
      return res.status(400).json({ error: 'Toten does not exists' });
    }

    const { oldPin } = req.body;

    if (oldPin && toten.pin != oldPin) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const response = await toten.update(req.body);

    return res.json({
      id: response.id,
      host: response.host,
    });
  }
}

export default new TotenController();
