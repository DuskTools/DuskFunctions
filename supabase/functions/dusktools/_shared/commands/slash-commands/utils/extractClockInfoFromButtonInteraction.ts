import { ButtonInteraction } from "discord.js"
import ClockService from "../../../services/ClockService.js"
import CampaignService from "../../../services/CampaignService.js"

export const extractClockInfoFromButtonInteraction = async (
  interaction: ButtonInteraction,
) => {
  const discordGuildId = interaction.guildId || ""
  const name = String(interaction.message.embeds[0].title)
  const campaign = await CampaignService.findOrCreateByDiscordId(
    discordGuildId,
  )
  return await ClockService.getClock({ name, campaign_id: campaign.id })
}
