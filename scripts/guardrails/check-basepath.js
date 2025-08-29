const fs = require('fs')
try {
  const txt = fs.readFileSync('next.config.js', 'utf8')
  if (/\bbasePath\s*:\s*['\"]/i.test(txt)) {
    console.error('\n\x1b[31mERROR:\x1b[0m next.config.js must NOT define basePath. Root (/) must work locally/prod; /mxtk only via env + getPublicPath.')
    process.exit(1)
  }
} catch (e) {
  // If next.config.js doesn't exist, allow build to continue
}

