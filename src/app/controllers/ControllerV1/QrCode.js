import EscPosEncoder from 'esc-pos-encoder';

function QrCode(qrdata) {
  /**
   * Função que gera um byte array para imprimir um QRCODE
   */

  // var ticket = qrdata.toString();
  // const len = qrdata.length;
  // for (var i = 0; i < 12 - len; i++) {
  //   ticket = '0' + ticket;
  // }

  var urldata = `http://192.168.8.103:3333/ticket/${qrdata}`;

  const cn = 49;
  const m = 49;
  const GS = 29; //0x1d
  const k = 107; //0x6b
  var SizeCode = 0;
  var DotSize = 7;

  // var modelQR = [GS, 0x28, k, 3, 0, cn, 65, 0]; //scheme
  var dotSize = [GS, 0x28, k, 3, 0, cn, 66, DotSize]; //0x03
  var size_QR = [GS, 0x28, k, 3, 0, cn, 67, SizeCode]; //0x03
  // var errorQR = [GS, 0x28, k, 3, 0, cn, 69, 0];
  var storeQR = [GS, 0x28, k, urldata.length + 3, 0, cn, 80, m];
  var printQR = [GS, 0x28, k, 3, 0, cn, 81, m];

  let encoder = new EscPosEncoder();
  let qrcode = encoder
    // .raw(modelQR)
    .raw(dotSize) // <-- QRCODE
    .raw(size_QR) // <-- QRCODE
    // .raw(errorQR)
    .raw(storeQR) // <-- QRCODE
    .raw(Buffer.from(urldata, 'utf8')) // <-- QRCODE
    .raw(printQR) // <-- QRCODE
    .text(qrdata)
    .encode();

  var strqrcode = new String();

  for (var char in qrcode) {
    strqrcode += qrcode[char].toString() + ',';
  }

  return strqrcode;
}
