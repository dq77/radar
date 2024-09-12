<script setup>
  import { ref, computed, reactive } from 'vue'
  import util from './util'
  const picList = ref([])
  const showIndex = ref(0)
  const picType = ref(0)
  const city = ref('sy')
  const showItem = computed(() => {
    return picList.value[showIndex.value] || {}
  })
  getInfo()

  // // 获取天气网HTML，提取图片信息并处理为JSON
  async function getInfo() {
    if (picType.value === 0) { // 单站
      const res = await fetch(util.cityInfo[city.value]).then(res => res.text())
      const picStr = res.slice(res.indexOf('<option'), res.indexOf('</select>')).split('\n\t\t\t\t\t\t\t\t')
      picList.value = picStr.map(item => {
        const time = item.slice(item.indexOf('>') + 1, item.indexOf('</'))
        return {
          time: time.replace(/年|月/g, "-").replace(/日|-时/g, " ").replace(/时/g, ":").replace(/分/g, ""),
          pic: item.slice(item.indexOf('https://'), item.indexOf('png') + 3)
        } 
      })
    } else { // 拼图
      const res = await fetch(util.cityInfo[city.value]).then(res => res.text())
      const jsonList = res.slice(res.indexOf("{'fn'"), -4).split('},')
      const totalList = jsonList.map(item => {
        return {
          time: item.slice(item.indexOf("'dt':'") + 6, item.indexOf("','fn1")),
          pic: 'https://pi.weather.com.cn/i/product/pic/l/' + item.slice(item.indexOf("'fn1':'") + 7, item.indexOf("png'") + 3)
        } 
      })
      picList.value = totalList.slice(totalList.length - 20) // 取最新20条
    }
  }

  function changeCity(city) {
    picList.value = []
    getInfo()
    showIndex.value = 0
  }
  function tooltipShow(e) {
    return showItem.value.time?.split(' ')[1]
  }


  /* 
    需要在服务器端Nginx配置好转发规则，如下：

      upstream products.weather.com.cn {
          server 120.52.95.236;
      }
      upstream d1.weather.com.cn {
          server 120.52.95.241;
      }
      server {
        listen 80;
        server_name www.diaoqw.top;
        location /radar {
            alias /usr/share/nginx/radar;
            index index.html index.htm;
        }
        location /totalweather {
            rewrite ^/totalweather(.*)$ $1 break;
            proxy_pass http://d1.weather.com.cn;
            proxy_set_header Referer "http://www.weather.com.cn/";
        }
        location /weather {
            add_header 'Access-Control-Allow-Origin' '*';
            rewrite ^/weather(.*)$ $1 break;
            proxy_pass http://products.weather.com.cn;
        }
    }

  */

</script>

<template>
<div class="weather">
  <div class="pic-type">
    <el-radio-group v-model="picType">
      <el-radio-button :label="0">单站雷达</el-radio-button>
      <el-radio-button :label="1">雷达拼图</el-radio-button>
    </el-radio-group>
  </div>
  <div class="pic-type" v-if="picType === 0">
    <el-radio-group v-model="city" @change="changeCity">
      <el-radio-button label="sy">沈阳</el-radio-button>
      <el-radio-button label="yk">营口</el-radio-button>
      <el-radio-button label="dl">大连</el-radio-button>
      <el-radio-button label="cy">朝阳</el-radio-button>
      <el-radio-button label="sh">上海</el-radio-button>
    </el-radio-group>
  </div>
  <div class="pic-type" v-if="picType === 1">
    <el-radio-group v-model="city" @change="changeCity">
      <el-radio-button label="qg">全国</el-radio-button>
      <el-radio-button label="hb">华北</el-radio-button>
      <el-radio-button label="db">东北</el-radio-button>
      <el-radio-button label="hd">华东</el-radio-button>
    </el-radio-group>
  </div>
  <div class="title">{{ showItem.time }}</div>
  <div v-loading="!picList.length"><img :src="showItem.pic" class="pic"></div>
  <div class="slide-cnt">
    <el-slider v-model="showIndex" :step="1" :max="picList.length ? picList.length - 1 : 10" :format-tooltip='tooltipShow' />
  </div>
  <div class="hide-img">
    <img v-for="item in picList" :src="item.pic" :key="item.pic">
  </div>
  
</div>
</template>
<style>
.weather{
  max-width: 500px;
  margin: 0 auto;
}
.pic-type{
  margin: 10px;
}
.title{
  margin-left: 10px;
}
.weather .pic{
  width: 100%;
  min-height: min(50vw, 300px);
}
.slide-cnt{
  padding: 20px 60px;
}
.hide-img{
  display: none;
}
</style>
