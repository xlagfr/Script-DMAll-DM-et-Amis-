const { Client } = require("discord.js-selfbot-v13");
const client = new Client();
const config = require("./config");

// dmall by Light2discord ( discord.gg/xlagfr )

client.on("ready", async () => {
    console.log(`${client.user.username} connecté.`);
    console.log("Récupération de vos amis et des conversations MP ouvertes...");

    await client.relationships.fetch();
    console.log(`Amis récupérés : ${client.relationships.friendCache.size}`);

    const dmChannels = client.channels.cache.filter(channel => channel.type === "DM");
    console.log(`Conversations MP ouvertes : ${dmChannels.size}`);

    let total = 0;
    let successfulSends = 0;
    let errorsSend = 0;

    // Envoi aux amis
    for (const friend of client.relationships.friendCache.values()) {
        try {
            if (!friend || !friend.username) throw new Error("Utilisateur introuvable");
            await sendMessageWithDelay(friend, config.message);
            successfulSends++;
            total++;
            console.log(`Message envoyé à ${friend.username}`);
        } catch (err) {
            errorsSend++;
            total++;
            console.error(`[ERREUR] Impossible d'envoyer le message à ${friend?.username || "ami inconnu"}. Raison : ${err.message}`);
        }
    }

    // Envoi aux conversations DM
    for (const [id, channel] of dmChannels) {
        try {
            if (!channel || channel.type !== "DM") throw new Error("Canal DM introuvable ou invalide");
            await sendMessageWithDelay(channel, config.message);
            successfulSends++;
            total++;
            console.log(`Message envoyé à une conversation avec l'ID : ${id}`);
        } catch (err) {
            errorsSend++;
            total++;
            console.error(`[ERREUR] Impossible d'envoyer le message à la conversation ID ${id}. Raison : ${err.message}`);
        }
    }

    console.log(`Le message a été envoyé à ${successfulSends} ${successfulSends > 1 ? "destinataires" : "destinataire"}. Mais ${errorsSend} ${errorsSend > 1 ? "destinataires ne l'ont pas reçu" : "destinataire ne l'a pas reçu"}.`);
});

async function sendMessageWithDelay(recipient, message) {
    await new Promise(resolve => setTimeout(resolve, 500));
    await recipient.send(message);
}

client.login(config.token); // code by Light discord.gg/xlagfr
