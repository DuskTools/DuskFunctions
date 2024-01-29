import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { RunningClockFooter, StoppedClockFooter } from '../clock/constants.js';
import { Colors } from 'discord.js';
const clockImage = (progress, segment) => `https://raw.githubusercontent.com/alxjrvs/bladesinthediscord/main/src/assets/clocks/${segment}/${progress}.png`;
const getColor = (progress, segment) => {
    const ratio = progress / segment;
    switch (true) {
        case ratio < 0.3333:
            return Colors.Green;
        case ratio < 0.6666:
            return Colors.Yellow;
        case ratio < 1:
            return Colors.Red;
        default:
            return Colors.DarkRed;
    }
};
export const buildClockMessageOptions = ({ name, segments, progress = 0, footerText = RunningClockFooter, link }) => {
    const fields = [
        {
            name: 'Progress',
            value: `${progress}/${segments}`
        }
    ];
    if (link) {
        fields.push({
            name: ' ',
            value: `[Jump To Clock](${link})`
        });
    }
    const embed = new EmbedBuilder()
        .setTitle(name)
        .setThumbnail(clockImage(progress, segments))
        .setColor(getColor(progress, segments))
        .setFooter({ text: footerText })
        .addFields(fields);
    const showStop = footerText === RunningClockFooter;
    const showDecrement = showStop && progress > 0 && progress <= segments;
    const showIncrement = showStop && progress < segments;
    const showStart = footerText === StoppedClockFooter;
    const buttons = [
        showIncrement &&
            new ButtonBuilder()
                .setCustomId(`bitdclock--increment`)
                .setLabel('+')
                .setStyle(ButtonStyle.Primary),
        showDecrement &&
            new ButtonBuilder()
                .setCustomId(`bitdclock--decrement`)
                .setLabel('-')
                .setStyle(ButtonStyle.Secondary),
        showStart &&
            new ButtonBuilder()
                .setCustomId(`bitdclock--start`)
                .setLabel('Restart')
                .setStyle(ButtonStyle.Primary),
        showStop &&
            new ButtonBuilder()
                .setCustomId(`bitdclock--stop`)
                .setLabel('Stop')
                .setStyle(ButtonStyle.Danger)
    ].filter((button) => button !== false);
    const components = new ActionRowBuilder().addComponents(buttons);
    if (components.components.length > 0) {
        return { embeds: [embed], components: [components] };
    }
    return { embeds: [embed], components: [] };
};