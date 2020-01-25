import Toten from '../models/Toten';
import TotenParam from '../models/TotenParam';
import * as Yup from 'yup';

class TotenParamController {
  async index(req, res) {
    const params = await TotenParam.findAll({
      include: [
        {
          model: Toten,
          as: 'host',
          attributes: ['id', 'host'],
        },
      ],
      attributes: ['param', 'value'],
    });
    return res.json(params);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      host_id: Yup.string().required(),
      param: Yup.string().required(),
      value: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const totenExist = await Toten.findByPk(req.body.host_id);
    if (!totenExist) {
      return res.status(400).json({ error: 'Toten does not exists' });
    }
    const { host_id, param, value } = req.body;
    const response = await TotenParam.create({ host_id, param, value });

    return res.json(response);
  }

  async update(req, res) {
    // const schema = Yup.object().shape({
    //   host: Yup.string(),
    //   oldPin: Yup.string().min(4),
    //   pin: Yup.string()
    //     .min(4)
    //     .when('oldPin', (oldPin, field) => (oldPin ? field.required() : field)),
    //   confirmPin: Yup.string().when('pin', (pin, field) =>
    //     pin ? field.required().oneOf([Yup.ref('pin')]) : field
    //   ),
    // });
    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }
    // const toten = await Toten.findOne({
    //   where: { host: req.body.host },
    // });
    // if (!toten) {
    //   return res.status(400).json({ error: 'Toten does not exists' });
    // }
    // const { oldPin } = req.body;
    // if (oldPin && toten.pin != oldPin) {
    //   return res.status(401).json({ error: 'Password does not match' });
    // }
    // const response = await toten.update(req.body);
    // return res.json({
    //   id: response.id,
    //   host: response.host,
    // });
  }
}

export default new TotenParamController();
