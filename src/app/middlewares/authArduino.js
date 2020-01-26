import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const { authHeader, ztoken } = req.headers;

  /**
   * Caso a requisição não informe um token ou login valildo
   * informa e encerra a requisição
   */
  if (!authHeader && !ztoken) {
    console.log(`Host [${res.connection.remoteAddress}] Dont have permission`);
    res.setHeader('error', 'Dont have permission');
    return res.status(401).send('Dont have permission');
  }

  if (authHeader) {
    const [mac, pin] = authHeader.split('@'); // <-- arduino/dispositivo envia macAdd@pin para autenticar
    const mylocalip = res.connection.remoteAddress; // <-- captura o ip do dispositivo remoto
    const mytoken = jwt.sign({ mac, pin, mylocalip }, authConfig.secret, {
      // <-- cria um token para o dispositivo remoto
      expiresIn: authConfig.expiresIn,
    });
    res.setHeader('ztoken', mytoken);
    res.setHeader('lcd_a', 'AUTENTICACAO OK ');
    res.setHeader('registered', 1);

    console.log(`Mac ${mac}, Pin ${pin}`);

    return next();
  } else {
    try {
      const decoded = await promisify(jwt.verify)(ztoken, authConfig.secret);

      /**
       * Verifica se o ip do dispositivo remoto é valido
       * Para maior segurança, voce também pode verificar se o mac e pin são validos
       */
      // console.log(`Mac ${decoded.mac}, Pin ${decoded.pin}`);

      if (res.connection.remoteAddress != decoded.mylocalip) {
        // console.log(` ---> authArduino remote host invalid`);
        res.setHeader('error', 'TOKEN INVALID');
        res.setHeader('lcd_a', ' TOKEN INVALID  ');
        res.setHeader('lcd_b', ' HOST  INVALID  ');
        res.setHeader('registered', 0);
        return res.send();
      } else {
        return next();
      }
    } catch (err) {
      /**
       * Informa dispositivo que o token é invalido e encerra a requisição
       */
      res.setHeader('error', 'TOKEN INVALID');
      res.setHeader('lcd_a', ' TOKEN INVALID  ');
      res.setHeader('registered', 0);
      return res.send();
    }
  }
  // console.log(`Mac ${mac}, Pin ${pin}`);
};
