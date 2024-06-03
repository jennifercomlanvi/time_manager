import * as devConfig from './dev';
import * as prodConfig from './prod';

const config = __DEV__ ? devConfig : prodConfig;

export default config;