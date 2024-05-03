using System;
using DiscordRPC;

class Program
{
    static void Main()
    {
        DiscordRpcClient client = new DiscordRpcClient("your_client_id_here");

        client.OnReady += (sender, e) =>
        {
            Console.WriteLine($"Connected to Discord as {e.User.Username}");
        };

        // Set up other event handlers as needed (e.g., OnPresenceUpdate)

        client.Initialize();

        // Set the rich presence
        DiscordRichPresence presence = new DiscordRichPresence
        {
            State = "chillin",
            Details = "eating popcorn",
            StartTimestamp = 1507665886,
            LargeImageKey = "embedded_cover",
            LargeImageText = "Numbani",
            SmallImageKey = "embedded_background",
            SmallImageText = "joker",
            PartyId = "ae488379-351d-4a4f-ad32-2b9b01c91657",
            PartySize = 1,
            PartyMax = 5,
            JoinSecret = "MTI4NzM0OjFpMmhuZToxMjMxMjM="
        };

        client.SetPresence(presence);

        // Keep your application running
        Console.ReadLine();

        // Clean up when done
        client.Dispose();
    }
}
