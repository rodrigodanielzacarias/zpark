let EscPosEncoder = require('esc-pos-encoder');

function QrCode(qrdata) {
  /**
   * Função que gera um byte array para imprimir um QRCODE
   */

  var urldata = `${qrdata}`;

  const cn = 49;
  const m = 49;
  const GS = 29;
  const k = 107;
  var SizeCode = 0;
  var DotSize = 7;

  var dotSize = [GS, 0x28, k, 3, 0, cn, 66, DotSize]; //0x03
  var sizeQR_ = [GS, 0x28, k, 3, 0, cn, 67, SizeCode]; //0x03
  var storeQR = [GS, 0x28, k, urldata.length + 3, 0, cn, 80, m];
  var printQR = [GS, 0x28, k, 3, 0, cn, 81, m];

  let encoder = new EscPosEncoder();
  let qrcode = encoder
    .raw(dotSize) // <-- QRCODE
    .raw(sizeQR_) // <-- QRCODE
    .raw(storeQR) // <-- QRCODE
    .raw(Buffer.from(urldata, 'utf8')) // <-- QRCODE
    .raw(printQR) // <-- QRCODE
    .text(qrdata)
    .encode();

  var strqrcode = new String();

  for (var char in qrcode) {
    strqrcode += qrcode[char].toString() + ',';
  }

  /**
   * retorna para o dispositivo string separado cada byte por ','
   */
  return strqrcode;
}
