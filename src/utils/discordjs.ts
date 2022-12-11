import {
  APIEmbed,
  CommandInteraction,
  InteractionReplyOptions,
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from 'discord.js'

type RepliableInteraction =
    | CommandInteraction
    | MessageComponentInteraction
    | ModalSubmitInteraction

export class InteractionReplier {
    private nextIsEphemeral: boolean

    constructor(
        private interaction: RepliableInteraction,
        private ephemeral: boolean,
    ) {
        this.nextIsEphemeral = this.ephemeral
    }

    async replyMessage(message: string, options?: Omit<InteractionReplyOptions, 'content' | 'ephemeral'>) {
        const ephemeral = this.nextIsEphemeral || this.ephemeral
        await this.interaction.reply({content: message, ephemeral: ephemeral, ...options})
        this.nextIsEphemeral = this.ephemeral
    }

    async replyEmbed(embed: APIEmbed, options?: Omit<InteractionReplyOptions, 'embeds' | 'ephemeral'>) {
        const ephemeral = this.nextIsEphemeral || this.ephemeral
        await this.interaction.reply({embeds: [embed], ephemeral: ephemeral, ...options})
        this.nextIsEphemeral = this.ephemeral
    }

    async replyEmbeds(embeds: APIEmbed[], options?: Omit<InteractionReplyOptions, 'embeds' | 'ephemeral'>) {
        const ephemeral = this.nextIsEphemeral || this.ephemeral
        await this.interaction.reply({embeds, ephemeral: ephemeral, ...options})
        this.nextIsEphemeral = this.ephemeral
    }

    nextEphemeral() {
        this.nextIsEphemeral = true
    }

    nextNotEphemeral() {
        this.nextIsEphemeral = false
    }
}