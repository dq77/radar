## 降水雷达图


建议使用手机端访问。

我劝你最好连个WiFi再打开下面的链接，中国天气网没有做图片优化，我爬到的降雨雷达拼图都很大，每张图都有2-3MB

项目体验地址：[https://www.767766.xyz/radar/](https://www.767766.xyz/radar/) 

爬取 [中国天气网](https://www.weather.com.cn/) 雷达数据并实时展示，基于vue3脚手架。

本来是使用Python + selenium 爬取的，但效率太低。后来又改成Python + Xpath爬取，但是配置请求头踩了好多坑。最后又换回了js......
**人生苦短，远离Python！**

## 配置项目后端地址及配置nginx转发规则

首先在项目代码的`src/views/home/util.js`中确认定义的域名(domainName)是否可用，**如果不可用需要更换域名**。

```
// 请在此处设置好请求的域名
const domainName = 'radar.domain.com'
```



服务端部署一共有两种方式，分别为 **服务器Nginx模式** 和 **Cloudflare Worker模式**

##### 首先说第一种：服务器Nginx模式

> 请确保域名已做好解析并且正确配置了证书
>
> 此处假设在`src/views/home/util.js`中配置的domainName为'radar.domain.com'

然后在域名对应的服务器上配置nginx的代理转发规则如下：

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

配置好后别忘了重启nginx配置生效。至此服务端配置完毕，接下来配置移动端。



##### 第二种模式：Cloudflare Worker模式

新建一个Cloudflare的Worker，名字随便起，内容全文粘贴如下：

```
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // 检查是否是预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // 移除URL中的reach前缀
  let pathname = url.pathname;
  if (pathname.startsWith('/weather/')) {
    pathname = pathname.replace('/weather/', '/');
    targetUrl = new URL('https://products.weather.com.cn' + pathname);
  } else if (pathname.startsWith('/totalweather/')) {
    pathname = pathname.replace('/totalweather/', '/');
    targetUrl = new URL('https://d1.weather.com.cn' + pathname);
  }


  url.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });
  const modifiedRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body
  });
  if (targetUrl.toString().includes('d1.weather.com.cn')) {
    modifiedRequest.headers.set('Referer', 'https://www.weather.com.cn/');
  }

  try {
    let response = await fetch(modifiedRequest);

    // 克隆响应并添加 CORS 头
    response = new Response(response.body, response);
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin') || '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}
```

然后发布Worker，新建一个自定义二级域名 radar.domain.com 即可。

#### 本地客户端

```sh
npm install
npm run dev
npm run build
```

