# zpark

Desenvolvimento de software para estacionamento utilizando gabinetes e placas ZPark

V1.0 Arduino *estavel
V2.0 Raspberry *em desenvolvimento

Para uma melhor performance do Arduino, optamos por passar os comandos no header.

Abaixo um resumo do principais comandos disponiveis para integração.

Maiores informações contate nos canais:
Whatsapp +55 51 99683-4984
Telegram https://t.me/rodrigodanielzacarias

Controller:

/\*\*

- Modelo de Controller para integração com ZPARK Versão Arduino
-
- Para uma melhor performance do arduino os comandos são retornados no 'header'
- e não no body como em aplicações padrão de backend
-
- # getAvulso() : Chamado quando o totem inicia um novo ciclo.
- Carrega dados do ticket na base de dados,
- preenche comandos para retornar para o arduino,
- Valida e envia.
-
- # putAvulsoCheckIn() : Avisa quando o cliente retirou o cupom do totem
- Aqui voce pode capturar o id, validar e atualizar a sua base de dados com a informação
- E na sequencia retornar com um texto para exibir no display
- Um bom exemplo de mensagem para envia seria:
-     lcd_a = ' SIGA EM FRENTE '
- e lcd_b = ' ---> ---> ---> '
-
- # postAvulsoCheckIn() : Avisa quando um ticket completou o checkin passando pela cancela
- Aqui voce pode capturar os dados e atualizar sua base de dados conforme necessario.
- Logo, pode também retornar novas mensagens para imprimir no display:
- Uma boa dica seria enviar DataHora atualizada
-
- # deleteAvulso() : Avisa quando um ciclo comecou mas nao completou.
- Aqui voce pode capturar os dados e remover, ou inutilizar na base de dados. Evitando fraudes
- \*# getDatetime() : Chamado quando o totem necessita a datahora atualizada
- \*/
