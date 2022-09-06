import fs from 'node:fs'
import YAML from 'yaml'

const _defpath = `./plugins/lin/config/lin.something.def.yaml`;

const somethingyamlpath = `./plugins/lin/config/lin.something.yaml`;

const _path = process.cwd().replace(/\\/g, '/');

if (!fs.existsSync(somethingyamlpath)) {//如果配置不存在，则复制一份默认配置到配置里面
    fs.copyFileSync(`${_defpath}`, `${somethingyamlpath}`);
}

async function getConfig(name, key) {//获取

    let config = YAML.parse(fs.readFileSync(somethingyamlpath, 'utf8'));

    if (!config[name][key]) {
        logger.error(`没有设置[${name}]:[${key}]    请前往[${somethingyamlpath}]设置！`);
    }
    return config[name][key];

}

export default { getConfig }
