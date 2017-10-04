const webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');
const webpack = require('webpack');

const ENV = process.env.IONIC_ENV;
const envConfigFile = require(`./config-${ENV}.json`);
const apiUrlConfig = envConfigFile.api_url;
const apiKeyConfig = envConfigFile.api_key;

webpackConfig.plugins.push(
    new webpack.DefinePlugin({
        webpackGlobalVars: {
            api_url: JSON.stringify(apiUrlConfig),
            api_key: JSON.stringify(apiKeyConfig),
            is_prod: ENV === 'prod' ? true : false,
        }
    })
);
