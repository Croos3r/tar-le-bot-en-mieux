import { ActivitiesOptions, ActivityType } from "discord.js";
import { Client } from 'discordx';
import { author, version } from '../../package.json';

export const VERSION_ACTIVITY: ActivitiesOptions = {
  name: `v${version} | by ${author.name}`,
  type: ActivityType.Playing,
  url: author.url,
}

export const CONTRIBUTE_ACTIVITY: ActivitiesOptions = {
  name: `Contribute on GitHub -> ${author.url}`,
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