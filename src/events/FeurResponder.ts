import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'
import { Message } from 'discord.js'

@Discord()
export class FeurResponder {
  //
  private static feurAsking = [ 'quoi', 'kwa' ]
  private static feurAskingTerminator = [ '?', '!', ' ', ':', '.', ',', ';', ')', '\'', '"', '/', '\n' ]
  private static feurReactionResponse = [ '🇫', '🇪', '🇺', '🇷' ]
  private static feurBotResponse = '01100110 01100101 01110101 01110010 00100000 01100110 01100100 01110000'
  private static feurLongResponseLimit = 40
  private static feurLongResponses = [
    'Alors je suis pas sur mais je crois que feur.',
    'Dans un premier temps je dirais que je suis d\'accord avec toi mais je pense tout de même que feur.',
    'Oui si on part de ce principe alors je dirais que feur.',
    'Je vois ce que tu veux dire et je pense que feur est une réponse assez pertinente.',
    'La réponse la plus adaptée est sans aucun doute feur.',
  ]
  private static feurLongResponseTimeout = 2

  async takeActionOnMessage(message: Message) {
    const feurAskingRegex = `(${FeurResponder.feurAsking.join('|')})(${FeurResponder.feurAskingTerminator.map(s => '\\' + s).join('|')}|$)`
    const cleanedContent = message.content.split('')
        // Filters out all non latin-1 characters and zero-width characters
        .filter(c => {
          const code = c.charCodeAt(0)
          console.log(`Character ${c} (d:${code}, h:${code.toString(16)})`)
          return code <= 255 && (code <= 126 || code >= 160) && ![ 0, 7, 14, 15 ].includes(code)
        })
        .join('')
    console.log(`Received message: "${cleanedContent}" (${message.id}) from ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.guild?.name}`)
    if (!cleanedContent.toLowerCase().match(feurAskingRegex) || message.author === message.client.user) {
      console.log('Message does not contain feur asking or is from this bot')
      return
    }

    if (message.author.bot) {
      console.log('Bot asking for feur, responding with binary')
      return await message.reply(FeurResponder.feurBotResponse).catch(console.error)
    }

    if (cleanedContent.length >= FeurResponder.feurLongResponseLimit) {
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

  @On({ event: 'messageCreate' })
  async onMessage([ message ]: ArgsOf<'messageCreate'>) {
    console.log('Received message creation')
    await this.takeActionOnMessage(message)
  }

  @On({ event: 'messageUpdate' })
  async onMessageUpdate([ _, newMessage ]: ArgsOf<'messageUpdate'>) {
    console.log('Received message update')
    await this.takeActionOnMessage(newMessage as Message)
  }
}
