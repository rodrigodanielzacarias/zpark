import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.permission;
  const ztoken = req.headers.ztoken;
  if (!authHeader && !ztoken) {
    res.setHeader({ error: 'Dont have permission' });
    return res.status(401).json({ error: 'Dont have permission' });
  }

  if (authHeader) {
    const [mac, pin] = authHeader.split('@');
    const mylocalip = res.connection.remoteAddress;
    const mytoken = jwt.sign({ mac, pin, mylocalip }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    // console.log('hostip: ', req.headers);
    res.setHeader('ztoken', mytoken);
    res.setHeader('lcd_a', 'AUTENTICACAO OK ');
    res.setHeader('registered', 1);
  } else {
    try {
      const decoded = await promisify(jwt.verify)(ztoken, authConfig.secret);

      req.userMac = decoded.mac;
      //req.userIp = decoded.mylocalip;

      if (res.connection.remoteAddress != decoded.mylocalip) {
        console.log(` ---> authArduino remote host invalid`);
        res.setHeader('error', 'TOKEN INVALID');
        res.setHeader('lcd_a', ' TOKEN INVALID  ');
        res.setHeader('lcd_b', ' HOST  INVALID  ');
        res.setHeader('registered', 0);
        return res.send();
      }

      return next();
    } catch (err) {
      console.log(` ---> authArduino Error Decode`);
      res.setHeader('error', 'TOKEN INVALID');
      res.setHeader('lcd_a', ' TOKEN INVALID  ');
      res.setHeader('registered', 0);
      return res.send();
    }
  }
  // console.log(`Mac ${mac}, Pin ${pin}`);

  return next();
};
