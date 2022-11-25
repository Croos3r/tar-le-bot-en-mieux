import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'

@Discord()
export class FeurResponder {
  private static feurAsking = [ 'quoi', 'quoi ?', 'quoi?', 'kwa', 'kwa ?', 'kwa?' ]
  private static feurResponse = [ '🇫', '🇪', '🇺', '🇷' ]

  @On({ event: 'messageCreate' })
  async onMessage([ message ]: ArgsOf<'messageCreate'>) {
    if (!message.author.bot && FeurResponder.feurAsking.some((feurAsking) => message.content.endsWith(feurAsking))) {
      console.log(`Responding to message '${message.content}'(${message.id}) from ${message.author.username}#${message.author.discriminator} in ${message.guild?.name}`)
      await Promise.all(FeurResponder.feurResponse.map(emote => message.react(emote)))
      console.log('Done')
    }
  }
}
