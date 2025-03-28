'use strict'

const semver = require('semver');
const colors = require('colors');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;

const pkg = require('../package.json');
const log = require('@snowypeak/snowpeak-log');
const constant = require('./const');

let args;

function checkPkgVersion(){
    log.notice('脚手架版本：', pkg.version)
}

function checkNodeVersion(){
    const currentVersion = process.version;
    // log.info('当前node版本：', currentVersion)
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    // log.info('最低node版本：', lowestVersion);
    if(!semver.gte(currentVersion, lowestVersion)){
        throw new Error(colors.red(`snowpeak-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
    }
}

function checkRoot(){
    const rootCheck = require('root-check');
    rootCheck();
}

function checkUserHome(){
    if(!userHome || !pathExists(userHome)){
        throw new Error(colors.red('当前登录用户主目录不存在'))
    }
}

function checkArgs(){
    if(args.debug){
        process.env.LOG_LEVEL = 'verbose';
    }else{
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}

function checkInputArgs(){
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2));
    console.log(args)
    checkArgs();
}

function core() {
    try{
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgs()
        log.verbose('debug','测试debug日志')
    } catch (e){
        log.error(e.message)
    }
}


module.exports = core;