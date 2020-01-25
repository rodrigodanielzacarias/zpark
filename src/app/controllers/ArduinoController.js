class ArduinoController {
  async index(req, res) {
    return res.json({ message: 'Arduino ok' });
  }

  async getAvulso(req, res) {
    if (req.headers.zpark != '0') {
      console.log(`--------- Alert Data: `, req.headers.zpark);
    }

    import CheckIn from '../models/Checkin';
    const checkin = await CheckIn.create({
      host: req.connection.remoteAddress,
    });

    var dateFormat = require('dateformat');
    var now = new Date();
    // var ticket = dateFormat(now, 'yymmddHHMMss');
    var ticket = checkin.id.toString();
    const len = ticket.length;
    for (var i = 0; i < 12 - len; i++) {
      ticket = '0' + ticket;
    }

    console.log('   --->   CheckIn Step 1 : ', ticket);

    var qrcode = QrCode(`${ticket}`);

    res.setHeader('zpark', `${ticket}`);
    res.setHeader('qrcode', `${qrcode}`);
    res.setHeader('lcd_a', ' APROXIME A MAO ');
    res.setHeader('lcd_b', `ID:${ticket}            `);
    res.setHeader('tck_one', `<a1><b1><t17>BEM VINDO`);
    res.setHeader('tck_two', `<b0><t0>ZPARK ESTACIONAMENTOS`);
    res.setHeader(
      'datetime',
      `<b0><t0>${dateFormat(now, 'dd/mm/yyyy HH:MM:ss')}`
    );
    res.setHeader(
      'tck_body',
      `<n><b1><t1>Valide seu CUPOM no interior da loja<b0><t0><n>Bilhete unico e intransferivel.<n>Mantenha seguro!<n>Nao nos responsabilizamos por pertences<n>deixados no interior do veiculo.`
    );

    return res.send();
  }

  async postAlert(req, res) {
    console.log(`--------- Alert Data: `, req.headers.zpark);

    res.setHeader('lcd_a', 'AGUARDE SUPORTE ');
    res.setHeader('lcd_b', `${req.headers.zpark}            `);

    return res.send();
  }

  async postAvulsoCheckIn(req, res) {
    console.log('   --->   CheckIn Step 3 : ', req.params.id);

    var dateFormat = require('dateformat');
    var now = new Date();

    res.setHeader('lcd_a', '* SUPER MENGER *');
    res.setHeader('lcd_b', `${dateFormat(now, 'dd/mm/yyyy HH:MM')}`);

    return res.send();
  }

  async putAvulsoCheckIn(req, res) {
    console.log('   --->   CheckIn Step 2 : ', req.params.id);
    res.setHeader('lcd_a', ' SIGA EM FRENTE ');
    res.setHeader('lcd_b', ` ---> ---> ---> `);

    return res.send();
  }

  async deleteAvulso(req, res) {
    res.setHeader('lcd_a', 'CUPOM CANCELADO ');
    res.setHeader('lcd_b', `ID:${req.params.id}                  `);

    return res.send();
  }

  async getDatetime(req, res) {
    var dateFormat = require('dateformat');
    var now = new Date();

    res.setHeader('lcd_a', '* SUPER MENGER *');
    res.setHeader('lcd_b', `${dateFormat(now, 'dd/mm/yyyy HH:MM')}`);

    return res.send();
  }

  async postRegister(req, res) {
    var dateFormat = require('dateformat');
    var now = new Date();

    res.setHeader('standby', 1);
    res.setHeader('lcd_a', '  AUTENTICADO   ');
    res.setHeader('lcd_b', `${dateFormat(now, 'dd/mm/yyyy HH:MM')}`);

    return res.send();
  }
}

function QrCode(qrdata) {
  // var store_len = qrdata.length + 3;
  //var store_pL = store_len % 256;
  //var store_pH = store_len / 256;

  var urldata = `http://192.168.8.103:3333/ticket/${qrdata}`;

  const cn = 49;
  const m = 49;
  const GS = 29; //0x1d
  const k = 107; //0x6b
  var SizeCode = 0;
  var DotSize = 7;

  // var modelQR = [GS, 0x28, k, 3, 0, cn, 65, 0]; //scheme
  var dotSize = [GS, 0x28, k, 3, 0, cn, 66, DotSize]; //0x03
  var sizeQR_ = [GS, 0x28, k, 3, 0, cn, 67, SizeCode]; //0x03
  // var errorQR = [GS, 0x28, k, 3, 0, cn, 69, 0];
  var storeQR = [GS, 0x28, k, urldata.length + 3, 0, cn, 80, m];
  var printQR = [GS, 0x28, k, 3, 0, cn, 81, m];

  let EscPosEncoder = require('esc-pos-encoder');

  let encoder = new EscPosEncoder();
  let qrcode = encoder
    // .raw(modelQR)
    .raw(dotSize)
    .raw(sizeQR_)
    // .raw(errorQR)
    .raw(storeQR)
    .raw(Buffer.from(urldata, 'utf8'))
    .raw(printQR)
    // .newline()
    .barcode(qrdata, 'ean13', 150)
    // .newline()
    .text(qrdata)
    // .newline()
    // .newline()
    .encode();

  var strqrcode = '';

  for (var char in qrcode) {
    strqrcode += qrcode[char].toString() + ',';
  }

  return strqrcode;
}

export default new ArduinoController();
