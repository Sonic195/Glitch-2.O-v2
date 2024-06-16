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
  .setColor(0xadd8e6)
  .setTitle("YouTube")
  .setURL("https://www.youtube.com/")
  .setAuthor({
    name: "Glitch 2.O",
    icon_URL:
      "https://cdn.glitch.global/735481a2-904c-41de-b19a-67260bbf38b2/IMG_0527.jpeg?v=1717832468897",
  })
  .setDescription("go get some popcorn")
  .setThumbnail(
    "https://cdn.glitch.global/735481a2-904c-41de-b19a-67260bbf38b2/IMG_0527.jpeg?v=1717832468897"
  )
  .addFields({
    name: "Amount of Glitchos left",
    value: "working on it",
  })
  .setTimestamp()
  .setFooter({
    text: "just chillin",
    icon_URL: "https://i.imgur.com/AfFp7pu.png",
  });

export const awakeEmbed = new EmbedBuilder()
.setColor(0x192871)
.setTitle("Bring The Bot Online")
.setDescription("if the bot goes offline, click on the button below to force it awake")