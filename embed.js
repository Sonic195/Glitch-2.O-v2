import { EmbedBuilder } from "discord.js";

export const testEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Test")
  .setURL("https://discord.js.org/")
  .setAuthor({
    name: "Glitch 2.O",
    icon_URL: "https://i.imgur.com/AfFp7pu.png",
    url: "https://discord.js.org",
  })
  .setDescription("testing embed")
  .setThumbnail("https://i.imgur.com/AfFp7pu.png")
  .addFields(
    { name: "Regular field title", value: "Some value here" },
    { name: "\\u200B", value: "\\u200B" },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
    { name: "Inline field title", value: "Some value here", inline: true }
  )
  .addFields({
    name: "Inline field title",
    value: "Some value here",
    inline: true,
  })
  .setImage("https://i.imgur.com/AfFp7pu.png")
  .setTimestamp()
  .setFooter({
    text: "Some footer text here",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
  });

export const ytEmbed = new EmbedBuilder()
.setColor(0)
.setTitle("YouTube");
