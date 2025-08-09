import cron from 'node-cron';
import { User } from '../models/user.model'; // Adjust path as needed
import { Op } from 'sequelize';

export function scheduleSubscriptionCheck(): void {
// Schedule tasks to be run on the server.
  cron.schedule('0 0 * * *', async (): Promise<void> => {
    console.log('Running cron job to check for lapsed subscriptions...'); // so I don't clear subscription hours before its actually midnight for the user.

  try {
      const now: Date = new Date();

    // Find users whose nextSubscription date is in the past and isSubscribed is still true
    const lapsedUsers = await User.findAll({
      where: {
        isSubscribed: true,
        nextSubscription: {
            [Op.lt]: now, // less than operator from Sequelize to efficiently query for users whose
          }, // nextSubscription date is in the past. This is much more efficient than
        }, // retrieving all users and filtering them in memory which can cause the app to crash
    });

    if (lapsedUsers.length > 0) {
      console.log(`Found ${lapsedUsers.length} lapsed subscriptions.`);

      // Update isSubscribed to false for these users
      await Promise.all(
          lapsedUsers.map(async (user: User) => {
          user.isSubscribed = false;
          await user.save();
          console.log(`Subscription lapsed for user: ${user.userID} (Email: ${user.email})`);
        })
      );

      console.log('Successfully updated lapsed subscriptions.');
    } else {
      console.log('No lapsed subscriptions found.');
    }
    } catch (error: any) {
    console.error('Error running subscription check cron job:', error);
  }
});

console.log('Subscription check cron job scheduled.');
};