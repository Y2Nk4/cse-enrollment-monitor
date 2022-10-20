let enrollmentStatus = require('./enrollment-stats')

enrollmentStatus().then(() => {
    console.log(`[${new Date().toUTCString()}] Done`)
})