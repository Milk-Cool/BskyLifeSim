# BskyLifeSim
This is a fairly simple non-interactive life sim, kinda similar to and using assets from Tomodachi Life. It posts all of the updates on its residents' social relationships to Bluesky instantly, and everyone gets to see what is happening in their little virtual lives. The virtual residents get friends, date, get married, break up and fight over food. I think it's a niche little project, albeit very simple.

## Setup
For this to work, you'll need Node.js and a Bluesky account.

0. Run `npm i` in the project directory to install dependencies.
1. Set the environment variables: `BSKY_USERNAME` and `BSKY_PASSWORD`. These can be set in a `.env` file like this:
```env
BSKY_USERNAME=coolbot.bsky.social
BSKY_PASSWORD=SecurePassword123
```
2. Initialize the database using the `initall.sh` script (or by running the commands from the script individually).
3. Download the required assets (see `res/README.md`).
4. Run the project with `npm start`.

## Debugging
To debug, you can set the `DEBUG` environment variable to a non-empty value. That way, nothing will be posted on Bluesky, the sim will not wait 5 minutes before the first simulation cycle and all the images will be saved to `debug/`.

## Project structure
```
Path       Description
----------------------------------------------
res/       Resources
| *.png    Assets
| *.map    Food and treasure name maps
image.js   Image manipulation (uses Jimp)
index.js   Mostly database utils
init*      Initialization scripts
items.js   Item management (food and treasure)
mii.js     Mii utils
names.txt  Names to use in initialization
news.js    News and diaries generator
sim.js     Main file executed on `npm start`
```