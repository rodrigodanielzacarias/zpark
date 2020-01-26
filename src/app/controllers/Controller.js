var TicketTable = []; // Database

class Controller {
  /* ... */
  async getAvulso(req, res) {
    /**
     * Gera um novo registro
     */
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
     * Confere se o codigo tem 12 caracteres,
     * caso contrario completa com '0' a esquerda
     */
    var ticket = Ticket.id.toString();
    const len = ticket.length;
    for (var i = 0; i < 12 - len; i++) {
      ticket = '0' + ticket;
    }

    res.setHeader('zpark', `${ticket}`);
    res.setHeader('lcd_a', ' RETIRE O CUPOM ');
    res.setHeader('lcd_b', `ID:${ticket}            `);
    res.setHeader(
      'tck_one', // <-- Texto Primeira linha do Ticket
      `BEM VINDO`
    );
    res.setHeader(
      'tck_two', // <-- Texto Segunda linha do Ticket
      `ZPARK ESTACIONAMENTOS`
    );
    res.setHeader(
      'datetime', // <-- Texto Terceira linha do Ticket
      `${dateFormat(new Date(), 'dd/mm/yyyy HH:MM:ss')}`
    );
    res.setHeader(
      'tck_body', // <-- Texto corpo do Ticket
      `Valide seu CUPOM no interior da loja<n>Bilhete unico e intransferivel.<n>Mantenha seguro!<n>Nao nos responsabilizamos por pertences<n>deixados no interior do veiculo.`
    );

    return res.send();
  }
  /* ... */
}
