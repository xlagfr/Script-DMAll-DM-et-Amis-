const { Client } = require("discord.js-selfbot-v13");
const client = new Client();
const config = require("./config");

// dmall by Light2discord ( discord.gg/xlagfr )

// Tableau pour suivre les utilisateurs deja dm
const alreadySent = new Set();

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

    // Env aux friend
    for (const friend of client.relationships.friendCache.values()) {
        try {
            if (!friend || !friend.username) throw new Error("Utilisateur introuvable");

            // Vérif si déjà envoyé
            if (alreadySent.has(friend.id)) {
                console.log(`Message déjà envoyé à ${friend.username}, passage au suivant.`);
                continue;
            }

            await sendMessageWithDelay(friend, config.message);
            alreadySent.add(friend.id); // Ajout dans le Set après envoi réussi
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

            // Vérification si déjà envoyé
            if (alreadySent.has(id)) {
                console.log(`Message déjà envoyé à la conversation ID ${id}, passage au suivant.`);
                continue;
            }

            await sendMessageWithDelay(channel, config.message);
            alreadySent.add(id); // Ajout dans le Set après envoi réussi
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
