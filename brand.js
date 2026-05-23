const { execSync } = require('child_process');
const { createCanvas } = require('canvas');
const fs = require('fs');


// GET APP NAME
const appName = process.argv[2] || 'AquaOat';


// SHORT NAME LOGIC
function getShortName(name) {
  name = name.trim();

  const words = name.split(/\s+/);

  // Quiz Flex → QF
  if (words.length >= 2) {
    return (
      words[0][0] + words[1][0]
    ).toUpperCase();
  }

  // AquaOat → AQ
  const clean = name.replace(/[^a-zA-Z0-9]/g, '');

  if (clean.length >= 2) {
    return (
      clean[0] + clean[1]
    ).toUpperCase();
  }

  return clean.toUpperCase();
}

const shortName = getShortName(appName);


// CANVAS
const size = 1024;

const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');


// TRANSPARENT BACKGROUND
ctx.clearRect(0, 0, size, size);


// LETTERS
const chars = shortName.split('');

ctx.font = 'bold 420px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';


// FIRST LETTER
ctx.fillStyle = '#f97316';

ctx.fillText(
  chars[0] || '',
  size / 2 - 140,
  size / 2
);


// SECOND LETTER
ctx.fillStyle = '#2563eb';

ctx.fillText(
  chars[1] || '',
  size / 2 + 140,
  size / 2
);


// CREATE ASSETS FOLDER
if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}


// SAVE ICON
const buffer = canvas.toBuffer('image/png');

fs.writeFileSync('assets/icon.png', buffer);

console.log(`✅ Icon Generated: ${shortName}`);


// UPDATE CAPACITOR APP NAME
// UPDATE CAPACITOR CONFIG
// UPDATE capacitor.config.json

const capacitorConfigPath =
  'capacitor.config.json';

if (fs.existsSync(capacitorConfigPath)) {

  const config = JSON.parse(
    fs.readFileSync(
      capacitorConfigPath,
      'utf8'
    )
  );

  config.appName = appName;

  fs.writeFileSync(
    capacitorConfigPath,
    JSON.stringify(config, null, 2)
  );

  console.log('✅ Capacitor Config Updated');
}


// UPDATE ANDROID APP NAME
const stringsPath =
  'android/app/src/main/res/values/strings.xml';

if (fs.existsSync(stringsPath)) {
  let strings = fs.readFileSync(
    stringsPath,
    'utf8'
  );

  strings = strings.replace(
    /<string name="app_name">.*<\/string>/,
    `<string name="app_name">${appName}</string>`
  );

  fs.writeFileSync(stringsPath, strings);

  console.log('✅ Android App Name Updated');
}
// UPDATE IOS APP NAME
// UPDATE IOS APP NAME
const iosPath =
  'ios/App/App/Info.plist';

if (fs.existsSync(iosPath)) {

  let plist = fs.readFileSync(
    iosPath,
    'utf8'
  );

  // Update Display Name
  plist = plist.replace(
    /<key>CFBundleDisplayName<\/key>\s*<string>.*?<\/string>/,
    `<key>CFBundleDisplayName</key>
    <string>${appName}</string>`
  );

  // Update Bundle Name
  plist = plist.replace(
    /<key>CFBundleName<\/key>\s*<string>.*?<\/string>/,
    `<key>CFBundleName</key>
    <string>${appName}</string>`
  );

  fs.writeFileSync(
    iosPath,
    plist
  );

  console.log('✅ iOS App Name Updated');
}


/// GENERATE ICONS
execSync(
  'npx capacitor-assets generate',
  { stdio: 'inherit' }
);


// SYNC
execSync(
  'npx cap sync',
  { stdio: 'inherit' }
);


// CROSS PLATFORM CLEAN
const isWindows =
  process.platform === 'win32';

const cleanCommand = isWindows
  ? 'cd android && gradlew clean'
  : 'cd android && ./gradlew clean';

execSync(
  cleanCommand,
  {
    stdio: 'inherit',
    shell: true
  }
);

console.log('✅ Android Clean Complete');

console.log('🚀 Branding Complete!');