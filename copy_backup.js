const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'frontend_backup');
const dest = path.join(__dirname, 'frontend');

if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log('Successfully restored backup to frontend!');
} else {
    console.log('Backup directory not found.');
}
