import { EmbedBuilder } from "npm:@discordjs/builders"
import { getColor } from "./getColor.ts"
import { getExplanation } from "./getExplanation.ts"
import { parseRolls } from "./parseRolls.ts"
import { getThumbnail } from "./getThumbail.ts"
import { getBladesRollType } from "./getBladesRollType.ts"
import { getSuccessString } from "./getSuccessString.ts"
import { generateRollResult } from "./generateRollResult.ts"
import { json } from "https://deno.land/x/sift@0.6.0/mod.ts"
import {
  APIApplicationCommandInteraction,
  InteractionResponseType,
} from "https://deno.land/x/discord_api_types@0.37.71/v10.ts"

const buildEmbed = (
  interaction: APIApplicationCommandInteraction,
) => {
  const diceArg =
    (interaction.data as unknown as { options: [{ value: number }] }).options
      ?.[0]?.value
  const quantity = diceArg === 0 ? 0 : diceArg || 1
  const result = generateRollResult(quantity)
  const bladesSuccess = getBladesRollType(result, quantity)
  const [explanationTitle, explanationValue] = getExplanation(
    quantity,
    interaction.member?.nick || "User",
  )
  const [successTitle, successValue] = getSuccessString(bladesSuccess)
  const thumbnail = getThumbnail(result.total, bladesSuccess)

  return new EmbedBuilder()
    .setColor(getColor(bladesSuccess))
    .setTitle(successTitle)
    .setDescription(successValue)
    .setThumbnail(thumbnail)
    .addFields({ name: "\u200B", value: "\u200B" })
    .addFields({ name: explanationTitle, value: explanationValue })
    .addFields(
      {
        name: "Rolls",
        value: `[${parseRolls(result, bladesSuccess)}]`,
        inline: true,
      },
      { name: "Total", value: `** ${result.total} **`, inline: true },
    ).toJSON()
}

export function handleRoll(
  interaction: APIApplicationCommandInteraction,
) {
  const embed = buildEmbed(interaction)

  return json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { embeds: [embed] },
  })
}