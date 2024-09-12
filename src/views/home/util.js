
const util = {}

// 请在此处设置好请求的域名
const domainName = 'radar.domain.com'

util.cityInfo = {
  sy: `https://${domainName}/weather/product/radar1/index/procode/JC_RADAR_AZ9240_JB_V3.shtml`,
  yk: `https://${domainName}/weather/product/radar1/index/procode/JC_RADAR_AZ9417_JB_V3.shtml`,
  dl: `https://${domainName}/weather/product/radar1/index/procode/JC_RADAR_AZ9411_JB_V3.shtml`,
  cy: `https://${domainName}/weather/product/radar1/index/procode/JC_RADAR_AZ9421_JB_V3.shtml`,
  sh: `https://${domainName}/weather/product/radar1/index/procode/JC_RADAR_AZ9002_JB_V3.shtml`,
  qg: `https://${domainName}/totalweather/radar/JC_RADAR_CHN_JB_V3.html`,
  hb: `https://${domainName}/totalweather/radar/JC_RADAR_HB_JB_V3.html`,
  db: `https://${domainName}/totalweather/radar/JC_RADAR_DB_JB_V3.html`,
  hd: `https://${domainName}/totalweather/radar/JC_RADAR_HD_JB_V3.html`,
}
export default util