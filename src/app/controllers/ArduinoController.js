import dateFormat from 'dateformat';

var TicketTable = [];

/**
 * Modelo de Controller para integração com ZPARK Versão Arduino
 *
 * Para uma melhor performance do arduino os comandos são retornados no 'header'
 * e não no body como em aplicações padrão de backend
 *
 * # getAvulso() : Chamado quando o totem inicia um novo ciclo.
 * Carrega dados do ticket na base de dados,
 * preenche comandos para retornar para o arduino,
 * Valida e envia.
 *
 * # putAvulsoCheckIn() : Avisa quando o cliente retirou o cupom do totem
 * Aqui voce pode capturar o id, validar e atualizar a sua base de dados com a informação
 * E na sequencia retornar com um texto para exibir no display
 * Um bom exemplo de mensagem para envia seria:
 *     lcd_a = ' SIGA EM FRENTE '
 *  e  lcd_b = ' ---> ---> ---> '
 *
 * # postAvulsoCheckIn() : Avisa quando um ticket completou o checkin passando pela cancela
 * Aqui voce pode capturar os dados e atualizar sua base de dados conforme necessario.
 * Logo, pode também retornar novas mensagens para imprimir no display:
 * Uma boa dica seria enviar DataHora atualizada
 *
 * # deleteAvulso() : Avisa quando um ciclo comecou mas nao completou.
 * Aqui voce pode capturar os dados e remover, ou inutilizar na base de dados. Evitando fraudes
 *
 *# getDatetime() : Chamado quando o totem necessita a datahora atualizada
 *
 */

class ArduinoController {
  async index(req, res) {
    /**
     * Depuração: return <table>TicketTable[]</table>
     */
    const _t =
      '<table style="width:100%;"><tr><th>id</th><th>hostAdd</th><th>createdAt</th><th>takedAt</th><th>checkinAt</th><th>validationAt</th><th>checkoutAt</th><th>canceledAt</th></tr>';
    var _d = new String();
    for (var row in TicketTable) {
      _d += `<tr><td>${TicketTable[row].id}</td>`;
      _d += `<td>${TicketTable[row].hostAdd}</td>`;
      _d += `<td>${TicketTable[row].createdAt}</td>`;
      _d += `<td>${TicketTable[row].takedAt}</td>`;
      _d += `<td>${TicketTable[row].checkinAt}</td>`;
      _d += `<td>${TicketTable[row].validationAt}</td>`;
      _d += `<td>${TicketTable[row].checkoutAt}</td>`;
      _d += `<td>${TicketTable[row].canceledAt}</td></tr>`;
    }

    return res.send(`${_t + _d}</table>`);
  }

  async getAvulso(req, res) {
    const { zpark } = req.headers;

    if (zpark) {
      /**
       * captura algum alerta/erro que possa ser informado
       * pelo totem
       */
    }

    const Ticket = {
      id: TicketTable.length + 1,
      hostAdd: req.connection.remoteAddress,
      createdAt: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
      takedAt: null,
      checkinAt: null,
      validationAt: null,
      checkoutAt: null,
      canceledAt: null,
    };

    TicketTable.push(Ticket);

    /**
     * Confere se o codigo tem 12 caracteres, caso contrario completa com '0' a esquerda
     */
    var ticket = Ticket.id.toString();
    const len = ticket.length;
    for (var i = 0; i < 12 - len; i++) {
      ticket = '0' + ticket;
    }

    // console.log('   --->   CheckIn Step 1 : ', TicketTable);

    var qrcode = QrCode(`${ticket}`); // <-- Caso deseje imprimir um QR CODE

    /**
     * Formatação e impressao de tickets
     * <a1> : alinhamento centralizado
     * <b1> : Negrito true
     * <t17>: Tamanho caracter *GRANDE  {ESCPOS Printer}
     * <b0> : Negrito false
     * <t0> : Tamanho caracter *DEFAULT {ESCPOS Printer}
     * <n>  : Nova linha {nl nf}
     */
    const TextFormat = {
      align: {
        center: '<a1>',
        left: '<a0>',
        right: '<a2>',
      },
      bold: {
        true: '<b1>',
        false: '<b0>',
      },
      fontSize: {
        normal: '<t0>',
        medium: '<t1>',
        big: '<t17>',
      },
      ENTER: '<n>',
    };

    res.setHeader('zpark', `${ticket}`);
    res.setHeader('qrcode', `${qrcode}`); // <-- Caso nao queira imprimir QRCODE, basta nao enviar essa linha
    res.setHeader('lcd_a', ' APROXIME A MAO ');
    res.setHeader('lcd_b', `ID:${ticket}            `);
    res.setHeader(
      'tck_one', // <-- Texto Primeira linha do Ticket
      `${TextFormat.align.center +
        TextFormat.bold.true +
        TextFormat.fontSize.big}BEM VINDO`
    );
    res.setHeader(
      'tck_two', // <-- Texto Segunda linha do Ticket
      `${TextFormat.bold.false +
        TextFormat.fontSize.normal}ZPARK ESTACIONAMENTOS`
    );
    res.setHeader(
      'datetime', // <-- Texto Terceira linha do Ticket
      `${TextFormat.bold.false +
        TextFormat.fontSize.normal +
        dateFormat(new Date(), 'dd/mm/yyyy HH:MM:ss')}`
    );
    res.setHeader(
      'tck_body', // <-- Texto corpo do Ticket
      `${TextFormat.ENTER +
        TextFormat.bold.true +
        TextFormat.fontSize
          .medium}Valide seu CUPOM no interior da loja${TextFormat.bold.false +
        TextFormat.fontSize.normal +
        TextFormat.ENTER}Bilhete unico e intransferivel.<n>Mantenha seguro!${
        TextFormat.ENTER
      }Nao nos responsabilizamos por pertences<n>deixados no interior do veiculo.`
    );

    return res.send();
  }

  async postAlert(req, res) {
    /**
     * Recebe mensagens de alerta do toten
     */

    const { zpark } = req.headers;

    if (zpark) {
      console.log(`--------- Alert Data: `, req.headers.zpark);
      res.setHeader('lcd_a', 'AGUARDE SUPORTE ');
      res.setHeader('lcd_b', `${req.headers.zpark}            `);
    }

    return res.send();
  }

  async postAvulsoCheckIn(req, res) {
    /**
     * Envia mensagens para exibir no LCD após passagem do veiculo pela cancela
     * Ticket_id enviado no req.params.id
     * Seta mensagens para exibir no LCD
     */

    const { id } = req.params; // <-- Ticket_id confirmação de checkin completo

    /**
     * Atualiza TicketTable[ticket].checkinAt
     */
    for (var ticket in TicketTable) {
      if (TicketTable[ticket].id == parseInt(id, 10)) {
        TicketTable[ticket].checkinAt = dateFormat(
          new Date(),
          'yyyy-mm-dd HH:MM:ss'
        );
      }
    }
    // console.log(TicketTable);

    res.setHeader('lcd_a', ' ESTACIONAMENTO ');
    res.setHeader('lcd_b', `${dateFormat(new Date(), 'dd/mm/yyyy HH:MM')}`);

    return res.send();
  }

  async putAvulsoCheckIn(req, res) {
    /**
     * Checkin 2º estagio: Informa que o cliente retirou o Cupom da impressora
     * Ticket_id enviado no req.params.id
     * Seta mensagens para exibir no LCD
     */

    const { id } = req.params;

    /**
     * Atualiza TicketTable[ticket].takedAt
     */
    for (var ticket in TicketTable) {
      if (TicketTable[ticket].id == parseInt(id, 10)) {
        TicketTable[ticket].takedAt = dateFormat(
          new Date(),
          'yyyy-mm-dd HH:MM:ss'
        );
      }
    }
    // console.log(TicketTable);

    res.setHeader('lcd_a', ' SIGA EM FRENTE ');
    res.setHeader('lcd_b', ` ---> ---> ---> `);

    return res.send();
  }

  async deleteAvulso(req, res) {
    /**
     * Função chamada quando um cliente não completa o checkin
     * Pode capturar o id e inutilizar na base de dados
     */

    const { id } = req.params;

    /**
     * Atualiza TicketTable[ticket].deletedAt
     */
    for (var ticket in TicketTable) {
      if (TicketTable[ticket].id == parseInt(id, 10)) {
        TicketTable[ticket].canceledAt = dateFormat(
          new Date(),
          'yyyy-mm-dd HH:MM:ss'
        );
      }
    }
    console.log(' -> Cupom nao completou checkin: ', id);

    // console.log(TicketTable);

    res.setHeader('lcd_a', 'CUPOM CANCELADO ');
    res.setHeader('lcd_b', `ID:${id}                  `);

    return res.send();
  }

  async getDatetime(req, res) {
    /**
     * Função chamada quando Totem necessita exibir DataHora no LCD
     */

    res.setHeader('lcd_a', ' ESTACIONAMENTO ');
    res.setHeader('lcd_b', `${dateFormat(new Date(), 'dd/mm/yyyy HH:MM')}`);

    return res.send();
  }

  async postRegister(req, res) {
    /**
     * Função de autenticação
     */

    res.setHeader('standby', 1);
    res.setHeader('lcd_a', '  AUTENTICADO   ');
    res.setHeader('lcd_b', `${dateFormat(new Date(), 'dd/mm/yyyy HH:MM')}`);

    return res.send();
  }
}

function QrCode(qrdata) {
  /**
   * Função que gera um byte array para imprimir um QRCODE
   */

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
    // .raw(dotSize)  // <-- QRCODE
    // .raw(sizeQR_)  // <-- QRCODE
    // // .raw(errorQR)
    // .raw(storeQR)  // <-- QRCODE
    // .raw(Buffer.from(urldata, 'utf8'))  // <-- QRCODE
    // .raw(printQR)  // <-- QRCODE
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
