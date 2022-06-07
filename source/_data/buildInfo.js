//
// Add Build Info to an 11ty Site | Aleksandr Hovhannisyan
//   https://www.aleksandrhovhannisyan.com/blog/eleventy-build-info/
//
//   aleksandrhovhannisyan.com/buildInfo.js at master  AleksandrHovhannisyan/aleksandrhovhannisyan.com
//     https://github.com/AleksandrHovhannisyan/aleksandrhovhannisyan.com/blob/master/src/_data/buildInfo.js
//   aleksandrhovhannisyan.com/footer.html at master · AleksandrHovhannisyan/aleksandrhovhannisyan.com
//     https://github.com/AleksandrHovhannisyan/aleksandrhovhannisyan.com/blob/master/src/_includes/footer.html
//

const childProcess = require('child_process');
//// const packageJson = require('../../package.json');

const getBuildInfo = function () {
    //
    var latestGitCommitHash = 'ZZZZZZZ';
    try {
        latestGitCommitHash = childProcess.execSync('git rev-parse --short HEAD')
            .toString()
            .trim();
    } catch (err) {
        // console.error(err);
    }

    const now = new Date();
    const timeZone = 'UTC';
    const buildTime = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone,
        })
        .format(now);
    //
    return {
        time: {
            raw: now.toISOString(),
            formatted: `${buildTime} ${timeZone}`,
        },
        hash: latestGitCommitHash,
        //// version: packageJson.version
    };
}

module.exports = getBuildInfo;
