/*
INIT.JS | The Initializer Script.
Run this if you have freshly downloaded the zip from the repository.
Runs every neccessary script so that the backend is connected with the database and data. 
Assuming you want 100% to be like our setup.

call it with npm run init-data.
*/

const { migrate } = require('./migrate-to-auth');
const { updateUsersLevelAndExperience, rebuildAllUsersLevelAndExperience} = require('./leveling-system');
const {  randomizeAllUserProfilePictures } = require('./profile-pictures');

(async () => {
  try {
    await migrate();
    await updateUsersLevelAndExperience();
    await rebuildAllUsersLevelAndExperience();
    await randomizeAllUserProfilePictures();
    console.log('Initialization completed');
    process.exit(0);
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
})();
