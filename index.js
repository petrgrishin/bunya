'use strict';

const readline = require('readline');
const prettyjson = require('prettyjson');
const { DateTime } = require('luxon');
const chalk = require('chalk');

const levelFormat = {
     0: chalk.bgBlackBright.white,
    10: chalk.bgBlackBright.white,
    20: chalk.bgBlackBright.white,
    30: chalk.bgBlue.black,
    40: chalk.bgYellow.black,
    50: chalk.bgRed.black,
    60: chalk.bgRed.black,
};

const textLevelFormats = {
     0: chalk.blackBright,
    10: chalk.blackBright,
    20: chalk.blackBright,
    30: chalk.blue,
    40: chalk.yellow,
    50: chalk.red,
    60: chalk.red,
};

const levelName = {
     0: 'LINE',
    10: 'TRACE',
    20: 'DEBUG',
    30: 'INFO',
    40: 'WARN',
    50: 'ERROR',
    60: 'FATAL',
};

const labelLevelFormat = (level, title = null) => {
    return levelFormat[level](` ${ title || levelName[level]} `);
};

const textLevelFormat = (level, title) => {
    return textLevelFormats[level](` ${ title } `);
};

const rl = readline.createInterface({
    input: process.stdin,
});

rl.on('line', (line) => {
    let parse = {};

    try {
        parse = JSON.parse(line);
    } catch (e) {
        return process.stdout.write(labelLevelFormat(0) + ` ${line}\n\n`);
    }

    const {
        level,
        pid,
        name,
        hostname,
        time,
        msg,
        ...object
    } = parse;

    try {
        if (object.data) {
            const a = object.data.replace(/'/g, '"').replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?(\w+)(['"])?:/g, '$1"$3":');
            object.data = JSON.parse(a);
        }
    } catch (e) {
        // console.error(e);
    }

    try {
        if (object.cookies) {
            object.cookies = JSON.parse(object.cookies);
        }
    } catch (e) {
        // console.error(e);
    }

    try {
        if (object.error.stack) {
            object.error.stack = String(object.error.stack)
                .split('\n')
                .reduce((o,v,k) => {
                    o[k] = v;
                    return o;
                }, {});

        }
    } catch (e) {
        // console.error(e);
    }

    const head = [];
    head.push(labelLevelFormat(level, pid));
    head.push(labelLevelFormat(level));

    try {

        head.push(labelLevelFormat(level, DateTime.fromISO(time).setLocale('ru').toLocaleString(DateTime.DATETIME_SHORT)));
    } catch (e) {
        // console.error(e);
    }

    head.push(textLevelFormat(level,  `${hostname}: ${msg}`));

    const message = [];
    message.push(head.join(' '));
    message.push(prettyjson.render(object));
    process.stdout.write(message.join('\n') + '\n\n');
});
