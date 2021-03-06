const config = require('../config.json');
const { Discord, client, channel, errEmbed } = require('./Discord');
const { logToFile } = require('../index');

logToFile('<src/Pathfind.js> Started', dir);
if (config.debug) log(`<src/Pathfind.js> load pathfind`);
async function followPlayer(username)
{
    logToFile('<src/Pathfind.js> followPlayer started', dir);
    if (config.debug) log(`<src/Pathfind.js> start pathfind`);
    try
    {
        const { bot, goals } = require('./Bot');
        const playerToFollow = bot.players[username].entity;

        await bot.pvp.stop();
        await bot.pathfinder.setGoal(null);
        bot.removeAllListeners('goal_reached');
        bot.pathfinder.setGoal(new goals.GoalFollow(playerToFollow, config.pathfind['pathfind-range']), true);

        bot.on('goal_reached', () =>
        {
            bot.removeAllListeners('diggingCompleted');
            bot.removeAllListeners('diggingAborted');
            bot.removeAllListeners('goal_reached');
        });

        const followEmbed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, '', 'https://github.com/DrMoraschi/AFKBot')
        .setColor(config.discord['embed-hex-color'])
        .setTitle('Following')
        .setThumbnail(client.user.avatarURL())
        .addFields(
            { name: 'Player', value: playerToFollow.username, inline: true },
            { name: 'Position', value: `x: ${Math.floor(playerToFollow.position.x)} y: ${Math.floor(playerToFollow.position.y)} z: ${Math.floor(playerToFollow.position.z)} `, inline: true },
        );
        
        await channel.send(followEmbed);
    }
    catch (err)
    {
        logToFile(`<src/Pathfind.js> Error: ${err}`, dir);
        errEmbed(err, `- Start the bot before using this command\n- Write the username correctly`);
    };
};

async function gotoCoord(vec3)
{
    logToFile('<src/Pathfind.js> gotoCoord started', dir);
    if (config.debug) log(`<src/Pathfind.js> start goto`);
    try
    {
        const { bot, goals } = require('./Bot');

        await bot.pvp.stop();
        await bot.pathfinder.setGoal(null);
        bot.removeAllListeners('goal_reached');
        bot.pathfinder.setGoal(new goals.GoalBlock(vec3.x, vec3.y, vec3.z));

        bot.on('goal_reached', () =>
        {
            bot.removeAllListeners('diggingCompleted');
            bot.removeAllListeners('diggingAborted');
            bot.removeAllListeners('goal_reached');
        });
    }
    catch (err)
    {
        logToFile(`<src/Pathfind.js> Error: ${err}`, dir);
        errEmbed(err, `- Start the bot before using this command\n- Write the username correctly`);
    };
};

function stopPathfind()
{
    logToFile('<src/Pathfind.js> Stop pathfinding', dir);
    if (config.debug) log(`<src/Pathfind.js> stop pathfind`);
    try
    {
        const { bot } = require('./Bot');
        bot.pathfinder.setGoal(null);
        bot.removeAllListeners('diggingCompleted');
        bot.removeAllListeners('diggingAborted');
        bot.removeAllListeners('goal_reached');
    }
    catch (err)
    {
        logToFile(`<src/Pathfind.js> Error: ${err}`, dir);
        errEmbed(err, `- Start the bot before using this command\n- Write the username correctly`);
    };
};

module.exports = {
    followPlayer,
    gotoCoord,
    stopPathfind
};