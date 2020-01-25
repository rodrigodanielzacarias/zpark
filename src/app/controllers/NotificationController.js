// import Appointment from '../models/Appointment';
// import { startOfHour, parseISO, isBefore } from 'date-fns';
// import * as Yup from 'yup';
// import User from '../models/User';
// import File from '../models/File';

var notifications = [
  {
    _id: 1,
    content: 'Novo agendamento de Fulano para dia 25 de Jan, às 17:00h',
    provider: 7,
    read: false,
    createdAt: '2020-01-21 13:00:00',
  },
  {
    _id: 2,
    content: 'Novo agendamento de Fulano para dia 25 de Jan, às 17:00h',
    provider: 7,
    read: false,
    createdAt: '2020-01-23 13:00:00',
  },
  {
    _id: 3,
    content: 'Novo agendamento de Fulano para dia 25 de Jan, às 17:00h',
    provider: 7,
    read: false,
    createdAt: '2020-01-23 15:45:20',
  },
  {
    _id: 4,
    content: 'Novo agendamento de Fulano para dia 25 de Jan, às 17:00h',
    provider: 7,
    read: false,
    createdAt: '2020-01-22 09:00:00',
  },
];
class NotificationController {
  async index(req, res) {
    return res.json(notifications);
  }

  async store(req, res) {
    return res.json(notifications);
  }
}

export default new NotificationController();
