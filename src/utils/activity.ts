import packageJson from '../../package.json' assert { type: 'json' };
import { ActivitiesOptions, ActivityType } from "discord.js";
import { Client } from 'discordx';

export const VERSION_ACTIVITY: ActivitiesOptions = {
  name: `v${packageJson.version} | by ${packageJson.author.name}`,
  type: ActivityType.Playing,
  url: packageJson.author.url,
}

export const CONTRIBUTE_ACTIVITY: ActivitiesOptions = {
  name: `Contribute on GitHub -> ${packageJson.author.url}`,
  type: ActivityType.Watching,
};

const ACTIVITIES: ActivitiesOptions[] = [
  VERSION_ACTIVITY,
  CONTRIBUTE_ACTIVITY,
];

export function rotateActivities(bot: Client, delay = 5, activities: ActivitiesOptions[] = ACTIVITIES): void {
  let i = 0;
  setInterval(() => {
    bot.user?.setActivity(activities[i++ % activities.length]);
  }, delay * 1000);
}