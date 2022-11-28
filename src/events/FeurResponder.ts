import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'

@Discord()
export class FeurResponder {
  private static feurAsking = [ 'quoi', 'kwa' ]
  private static feurReactionResponse = [ '🇫', '🇪', '🇺', '🇷' ]
  private static feurBotResponse = '01100110 01100101 01110101 01110010 00100000 01100110 01100100 01110000'
  private static feurLongResponseLimit = 40
  private static feurLongResponses = [
    'Alors je suis pas sur mais je crois que feur',
    'Dans un premier temps je dirais que je suis d\'accord avec toi mais je pense tout de même que feur',
    'Oui si on part de ce principe alors je dirais que feur',
    'Je vois ce que tu veux dire cependant je pense que feur est une réponse assez pertinente.',
    'La réponse la plus adaptée est sans aucun aucun doute feur',
  ]
  private static feurLongResponseTimeout = 2

  @On({ event: 'messageCreate' })
  async onMessage([ message ]: ArgsOf<'messageCreate'>) {
    console.log(`Received message: "${message.content}" (${message.id}) from ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.guild?.name}`)
    if (!FeurResponder.feurAsking.some(asking => message.content.toLowerCase().includes(asking)) || message.author === message.client.user) {
      console.log('Message does not contain feur asking or is from this bot')
      return
    }

    if (message.author.bot) {
      console.log('Bot asking for feur, responding with binary')
      return await message.reply(FeurResponder.feurBotResponse).catch(console.error)
    }

    if (message.content.length >= FeurResponder.feurLongResponseLimit) {
      console.log(`Long message asking for feur, responding with long response in ${FeurResponder.feurLongResponseTimeout} seconds`)
      await message.channel.sendTyping().catch(console.error)
      setTimeout(async () => {
        console.log('Sending long response')
        await message.reply(FeurResponder.feurLongResponses[Math.floor(Math.random() * FeurResponder.feurLongResponses.length)]).catch(console.error)
      }, FeurResponder.feurLongResponseTimeout * 1000)
      return
    }

    console.log('Short message asking for feur, responding with reactions')
    await Promise.all(FeurResponder.feurReactionResponse.map(async char => await message.react(char))).catch(console.error)
  }
}
