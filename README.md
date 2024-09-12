## 降水雷达图


建议使用手机端访问。

我劝你最好连个WiFi再打开下面的链接，中国天气网没有做图片优化，我爬到的降雨雷达拼图都很大，每张图都有2-3MB

项目体验地址：[https://www.767766.xyz/radar/](https://www.767766.xyz/radar/) 

爬取 [中国天气网](https://www.weather.com.cn/) 雷达数据并实时展示，基于vue3脚手架。

本来是使用Python + selenium 爬取的，但效率太低。后来又改成Python + Xpath爬取，但是配置请求头踩了好多坑。最后又换回了js......
**人生苦短，远离Python！**

## 配置项目后端地址及配置nginx转发规则

首先在项目代码的`src/views/home/util.js`中确认定义的域名(domainName)是否可用，**如果不可用需要更换域名**。

>  域名后面的请求前缀如'weather'和'totalweather'不要改
>
>  请确保域名已做好解析并且正确配置了证书

然后在域名对应的服务器上配置nginx的代理转发规则如下：

> 此处假设在`src/views/home/util.js`中配置的domainName为'radar.domain.com'

```
    server {
        listen 80;
        server_name radar.domain.com;
        
        location /weather/ {
            add_header 'Access-Control-Allow-Origin' '*' always;
            proxy_pass https://products.weather.com.cn/;
            rewrite ^/weather/(.*)$/$1 break;
        }
        location /totalweather/ {
            proxy_set_header Referer "https://www.weather.com.cn/";
            proxy_pass https://d1.weather.com.cn/;
            rewrite ^/totalweather/(.*)$/$1 break;
        }
    }
```


至此服务端配置完毕，接下来启动移动端

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
