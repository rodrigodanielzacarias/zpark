# Zpark V1.0 Api para automação de estacionamentos

Modelo de desenvolvimento para aplicação backend do seu projeto de automação de estacionamentos (CarParking Systems).
Esta api foi desenvolvida essclusivamente para uso com gabinetes e placas ZPARK (http://zacarias.me). Porem pode ser utilizado para fins de estudo e desenvolvimento sem restrições.

- v1.0 Integração com Arduino Estavel
- V2.0 Integração com Raspberry \*Não publicado

Recursos:

- Escutar dispositivos remotos de forma rapida e inteligente
- Manipular os Middlewares de autenticação conforme seu app
- Integrar banco de dados e escalar sua aplicação

> Para a v1.0 Arduino optamos por enviar informações
> no header do response. Pois melhora a performance
> do hardware remoto.

### Comercial e Suporte

Para mais informações você pode contatar nos canais [WhatsApp +55 (51) 99683-4984](https://api.whatsapp.com/send?phone=5551996834984&text=Ola) ou Telegram [@rodrigodanielzacarias](https://t.me/rodrigodanielzacarias)

### Instalação

Zpark requer [Node.js](https://nodejs.org/) v12+ && Yarn

Após clonar o repósitorio, basta rodar yarn e aguardar a instalação de todas as dependencias.

> install dependencies

```sh
$ yarn
```

> ...then
> run server

```sh
$ yarn dev
```

# Comandos

todos os comando são enviados no header

```sh
res.setHeader('zpark', 'comando'); // comando de uso geral
res.setHeader('lcd_a', 'TEXTO PARA IMPRIMIR NO LCD'); // imprimir na linha superior do lcd
res.setHeader('lcd_b', 'TEXTO PARA IMPRIMIR NO LCD'); // imprimir na linha inferior do lcd
res.setHeader('standby', '1'); // 1 habilita modo standby, 0 desabilita
res.setHeader('qrcode', bytearray); // aramzena um byte array para gerar um qrcode na impressora
res.setHeader('lcd_a', 'TEXTO PARA IMPRIMIR NO LCD'); // imprimir na linha superior do lcd
res.setHeader('tck_one', 'TEXTO PARA IMPRIMIR'); // imprimir na linha ...
res.setHeader('tck_two', 'TEXTO PARA IMPRIMIR'); // imprimir na linha ...
res.setHeader('tck_body', 'TEXTO PARA IMPRIMIR'); // imprimir na linha ...
res.setHeader('datetime', 'TEXTO PARA IMPRIMIR'); // imprimir na linha ...
```

> > Mais comandos serão implementados em breve

# DataBase

> Esse modelo não dispõe de conexão com base de dados. Você precisará implementar seu codigo para integrar

## AuthMiddleware

> Exemplo:

```sh
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  /**
   * Caso a requisição não informe um token ou login valildo
   * informa e encerra a requisição
   */
  const { authHeader, ztoken } = req.headers;
  if (!authHeader && !ztoken) {
    console.log(`Host [${res.connection.remoteAddress}] Dont have permission`);
    res.setHeader('error', 'Dont have permission');
    return res.status(401).send('Dont have permission');
  }
  if (authHeader) {
    /**
     * Cria um token
     */
    const [mac, pin] = authHeader.split('@');
    const mylocalip = res.connection.remoteAddress; // <-- remote address
    const mytoken = jwt.sign({ mac, pin, mylocalip }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    res.setHeader('ztoken', mytoken);
    res.setHeader('lcd_a', 'AUTENTICACAO OK ');
    res.setHeader('registered', 1);
    return next();
  } else {
    try {
      /**
       * Verifica se o ip do dispositivo remoto é valido
       * Para maior segurança, voce também pode verificar se o mac e pin são validos
       */
      const decoded = await promisify(jwt.verify)(ztoken, authConfig.secret);
      if (res.connection.remoteAddress != decoded.mylocalip) {
        res.setHeader('error', 'TOKEN INVALID');
        res.setHeader('lcd_a', ' TOKEN INVALID  ');
        res.setHeader('lcd_b', ' HOST  INVALID  ');
        res.setHeader('registered', 0);
        return res.send();
      } else {
        return next();
      }
    } catch (err) {
      res.setHeader('error', 'TOKEN INVALID');
      res.setHeader('lcd_a', ' TOKEN INVALID  ');
      res.setHeader('registered', 0);
      return res.send();
    }
  }
};
```

# Funções basicas do Controller:

#### [getAvulso()]()

Quando o totem inicia um novo ciclo

> Carrega dados do ticket na base de dados,
> preenche comandos para retornar para o dispositivo,
> Valida e envia.
> exemplo:

```sh
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
```

---

#### [putAvulsoCheckIn()]()

Avisa quando o cliente retirou o cupom do totem

> Aqui voce pode capturar o id, validar e atualizar a sua base de dados com a informação
> E na sequencia retornar com um texto para exibir no display
> Um bom exemplo de mensagem para envia seria:

```sh
{'lcd_a': ' SIGA EM FRENTE '} //mensagens de 16 caracteres cada linha
{'lcd_b': ' ---> ---> ---> '}
```

---

#### [postAvulsoCheckIn()]()

Avisa quando um cliente completou o checkin passando pela cancela

> Aqui voce pode capturar os dados e atualizar sua base de dados conforme necessario.
> Logo, pode também retornar novas mensagens para imprimir no display:
> Uma boa dica seria enviar DataHora atualizada

---

#### [deleteAvulso()]()

Avisa quando um ciclo expirou mas não completou

> Aqui voce pode capturar os dados e remover, ou inutilizar na base de dados. Evitando fraudes

---

#### [getDatetime()]()

Retorna datahora atualizada

---

### Geral:

Criado por Rodrigo Daniel Zacarias

[rodrigo@zacarias.me](mailto:rodrigo@zacarias.me)

WhatsApp [ +55 (51) 99683-4984](https://api.whatsapp.com/send?phone=5551996834984&text=Ola)

Telegram [@rodrigodanielzacarias](https://t.me/rodrigodanielzacarias)

## License

MIT
