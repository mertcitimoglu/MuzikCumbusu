const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('youtube-dl-exec');
const ffmpeg = require('ffmpeg-static');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const player = createAudioPlayer();

client.once('ready', () => {
    console.log('Bot hazır!');
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('!çal')) {
        const args = message.content.split(' ');
        const query = args.slice(1).join(' ');
        if (!message.member.voice.channel) return message.reply('Önce bir sesli kanala katılmalısınız!');
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });
        const stream = ytdl.raw(query, { o: '-', q: '', f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio', r: '1M' });
        const resource = createAudioResource(stream.stdout, { inputType: 'webm/opus', inlineVolume: true });
        player.play(resource);
        connection.subscribe(player);
        message.reply(`Çalınıyor: ${query}`);
    } else if (message.content === '!dur') {
        player.stop();
        message.reply('Müzik durduruldu.');
    } else if (message.content === '!sesaç') {
        player.setVolume(player.state.resource.volume.volume + 0.1);
        message.reply('Ses açıldı.');
    } else if (message.content === '!seskıs') {
        player.setVolume(player.state.resource.volume.volume - 0.1);
        message.reply('Ses kısıldı.');
    } else if (message.content === '!geç') {
        player.stop();
        message.reply('Müzik geçildi.');
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

// Basit bir HTTP sunucusu ekleyelim
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
