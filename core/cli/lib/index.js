'use strict'

const path = require('path');
const semver = require('semver');
const colors = require('colors');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;


const pkg = require('../package.json');
const log = require('@snowypeak/cli-log');
const constant = require('./const');

let args;
let config;

/**
 * 检查并显示当前脚手架版本号
 */
function checkPkgVersion(){
    log.notice('脚手架版本:', pkg.version)
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
    checkArgs();
}

function createDefaultConfig(){
    const cliConfig = {
        home: userHome
    }
    if(process.env.CLI_HOME){
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    }else{
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

function checkEnv(){
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if(pathExists(dotenvPath)){
        config = dotenv.config({
            path: dotenvPath
        })
    }
    createDefaultConfig()
    log.verbose('环境变量:', process.env.CLI_HOME_PATH)
}


function checkGlobalUpdate(){
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    const {getNpmInfo} = require('@snowypeak/cli-get-npm-info');
    getNpmInfo(npmName);
}


function core() {
    try{
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgs()
        checkEnv()
        checkGlobalUpdate()
    } catch (e){
        log.error(e.message)
    }
}


module.exports = core;