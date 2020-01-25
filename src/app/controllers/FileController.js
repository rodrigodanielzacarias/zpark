import File from '../models/File';
import User from '../models/User';

class FileController {
  async store(req, res) {
    const { originalname: originalname, filename: path } = req.file;

    const file = await File.create({
      name: originalname,
      path,
    });

    const user = await User.findByPk(req.userId);
    const response = await user.update({ avatar_id: file.dataValues.id });
    const avatar = await getAvatar(req.userId);
    return res.json(avatar);
  }
}

async function getAvatar(id) {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'avatar_id'],
    include: [
      {
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    ],
  });

  const { avatar } = user;

  return { id: avatar.id, url: avatar.url };
}

export default new FileController();
