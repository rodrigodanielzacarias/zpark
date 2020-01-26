# Zpark V1.0 Api para automação de estacionamentos

Modelo de desenvolvimento para aplicação backend do seu projeto de automação de estacionamentos (CarParking Systems).
Esta api foi desenvolvida essclusivamente para uso com gabinetes e placas ZPARK (http://zacarias.me). Porem pode ser utilizado para fins de estudo e desenvolvimento sem restrições.

- v1.0 Integração com Arduino Estavel
- V2.0 Integração com Raspberry \*Não publicado

Essa api permite:

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

# Funções basicas do Controller:

#### [getAvulso()]()

Chamado quando o totem inicia um novo ciclo

> Carrega dados do ticket na base de dados,
> preenche comandos para retornar para o arduino,
> Valida e envia.

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

Avisa quando um ticket completou o checkin passando pela cancela

> Aqui voce pode capturar os dados e atualizar sua base de dados conforme necessario.
> Logo, pode também retornar novas mensagens para imprimir no display:
> Uma boa dica seria enviar DataHora atualizada

---

#### [deleteAvulso()]()

Avisa quando um ciclo comecou mas nao completou.

> Aqui voce pode capturar os dados e remover, ou inutilizar na base de dados. Evitando fraudes

---

#### [getDatetime()]()

Chamado quando o totem necessita a datahora atualizada

---

### Geral:

Criado por Rodrigo Daniel Zacarias
[rodrigo@zacarias.me](mailto:rodrigo@zacarias.me)
WhatsApp [ +55 (51) 99683-4984](https://api.whatsapp.com/send?phone=5551996834984&text=Ola)
Telegram [@rodrigodanielzacarias](https://t.me/rodrigodanielzacarias)

## License

MIT
