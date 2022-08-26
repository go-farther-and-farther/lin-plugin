
import { pipeline } from 'stream'
import { promisify } from 'util'
import fetch from 'node-fetch'
import fs from 'node:fs'
import YAML from 'yaml'

const _defpath = `./plugins/lin/config/lin.something.def.yaml`;

const somethingyamlpath = `./plugins/lin/config/lin.something.yaml`;

const _path = process.cwd().replace(/\\/g, '/');

if (!fs.existsSync(somethingyamlpath)) {
    fs.copyFileSync(`${_defpath}`, `${somethingyamlpath}`);
}

async function getConfig(name, key) {

    let config = YAML.parse(fs.readFileSync(somethingyamlpath, 'utf8'));

    if (!config[name][key]) {
        logger.error(`没有设置[${name}]:[${key}]    请前往[${somethingyamlpath}]设置！`);
    }
    return config[name][key];

}

async function getData(model,datas) {
    
    let data = {
        quality: 90,
        tplFile: `./plugins/lin/resources/html/${model}/${model}.html`,
        /** 绝对路径 */
        pluResPath: `${_path}/plugins/lin/resources/`,
        ...datas,
    }
    
    return data;
}

export default { getConfig, getData }
