'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

const log = require('@snowypeak/cli-log');


function getDefaultRegistry(isOriginal = true){
    return isOriginal ? "https://registry.npmjs.org" : 'https://registry.npmmirror.com'
}


function getNpmInfo(npmName, registry){
    // console.log(npmName, registry);
    if(!npmName){
        return null;
    }
    const registryUrl = registry || getDefaultRegistry();
    const npmInfoUrl = urlJoin(registryUrl, npmName);
    log.info(npmInfoUrl);
    log.warn('惠茹跟上节奏');
}


module.exports = {
    getNpmInfo
}