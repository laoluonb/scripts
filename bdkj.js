/*
------------------------------------------
@Author: 老罗 2050768976
@Date: 2024.06.24 19:47
@Description: 本电科技每日签到 和设备详情
              v1.1 添加了使用和购买加速卡功能
              v1.2 添加了自动提现功能
------------------------------------------
变量名 kiwisWtoken
变量值 wx抓https://www.bdkjcdn.com/wapi/任意请求头
[Script]
http-response

[MITM]
hostname = 

⚠️【免责声明】
------------------------------------------
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
*/

const axios = require('axios');
const kiwisWtoken = ''; // wx抓https://www.bdkjcdn.com/wapi/任意请求头
const userId = qq号; // cq需要发送的qq号
const goodsId = 2; // 1为加速1天卡 2为加速3天卡
const point = 500;//提现积分100=1元 5元起提

let logMessage = ''; // 该处默认即可

// 通过post访问cq机器人的发送系统
async function sendLogMessage() {
  const url = 'http://10.10.10.26:5700/send_private_msg';//自己cq机器人的地址
  const data = {
    user_id: userId,
    message: logMessage.trim() // 修剪任何前后空白
  };

  try {
    const response = await axios.post(url, data);
    console.log('发送消息成功日志:', response.data);
  } catch (error) {
    console.error('发送消息失败日志:', error.message);
  } finally {
    // 发送后清除 logMessage 变量 默认即可
    logMessage = '';
  }
}

// 每日签到
async function checkIn() {
  const config = {
    method: 'GET',
    url: 'https://www.bdkjcdn.com/wapi/activity/daily_sign',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a1b)XWEB/9165',
      'xweb_xhr': '1',
      'kiwis-wtoken': kiwisWtoken,
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://servicewechat.com/wx003e375904180915/66/page-frame.html',
      'accept-language': 'zh-CN,zh;q=0.9'
    }
  };

  try {
    const response = await axios.request(config);
    const jsonData = response.data;
    if (jsonData.success) {
      logMessage += '签到成功\n';
      console.log('签到成功');
    } else {
      logMessage += '签到失败(可能是你已经签到过了，无法再次签到)\n';
      console.log('签到失败(可能是你已经签到过了，无法再次签到)');
    }
  } catch (error) {
    logMessage += `签到失败: ${error.message}\n`;
    console.log('签到失败:', error);
  }
}

// 获取mht的数据
async function getDeviceDetail() {
  const config = {
    method: 'GET',
    url: 'https://www.bdkjcdn.com/wapi/mht_device/detail',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a1b)XWEB/9165',
      'xweb_xhr': '1',
      'kiwis-wtoken': kiwisWtoken,
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://servicewechat.com/wx003e375904180915/66/page-frame.html',
      'accept-language': 'zh-CN,zh;q=0.9'
    }
  };

  try {
    const response = await axios.request(config);
    if (response.status !== 200) {
      logMessage += `请求失败，状态码：${response.status}\n`;
      return;
    }

    const jsonData = response.data;
    if (jsonData && typeof jsonData === 'object' && jsonData.success) {
      const todayPoint = jsonData.data.todayPoint;
      const onlineDeviceCount = jsonData.data.onlineDeviceCount;

      logMessage += `每日积分: ${todayPoint}, 在线设备数: ${onlineDeviceCount}\n`;
      console.log('每日积分:', todayPoint);
      console.log('在线设备数:', onlineDeviceCount);
    } else {
      logMessage += '响应数据中未包含成功标志或数据字段\n';
      console.log('响应数据中未包含成功标志或数据字段');
    }
  } catch (error) {
    logMessage += `获取设备详情失败: ${error.message}\n`;
    console.error('获取设备详情失败:', error);
  }
}

// 获取昨日积分和总积分
async function getYesterdayPoint() {
  const config = {
    method: 'GET',
    url: 'https://www.bdkjcdn.com/wapi/financial/point_info',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a1b)XWEB/9165',
      'xweb_xhr': '1',
      'kiwis-wtoken': kiwisWtoken,
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://servicewechat.com/wx003e375904180915/66/page-frame.html',
      'accept-language': 'zh-CN,zh;q=0.9'
    }
  };

  try {
    const response = await axios.request(config);
    if (response.status !== 200) {
      logMessage += `请求失败，状态码：${response.status}\n`;
      return;
    }

    const jsonData = response.data;
    if (jsonData && typeof jsonData === 'object' && jsonData.success) {
      const yesterdayPoint = jsonData.data.yesterdayPoint;
      const restPoint = jsonData.data.restPoint;

      logMessage += `昨日积分: ${yesterdayPoint}, 总积分: ${restPoint}\n`;
      console.log('昨日积分:', yesterdayPoint);
      console.log('总积分:', restPoint);
    } else {
      logMessage += '响应数据中未包含成功标志或数据字段\n';
      console.log('响应数据中未包含成功标志或数据字段');
    }
  } catch (error) {
    logMessage += `获取昨日积分失败: ${error.message}\n`;
    console.error('获取昨日积分失败:', error);
  }
}

// 获取所拥有的小桃币
async function restTaoCoin() {
  const config = {
    method: 'GET',
    url: 'https://www.bdkjcdn.com/wapi/user/user_info',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a1b)XWEB/9165',
      'xweb_xhr': '1',
      'kiwis-wtoken': kiwisWtoken,
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://servicewechat.com/wx003e375904180915/66/page-frame.html',
      'accept-language': 'zh-CN,zh;q=0.9'
    }
  };

  try {
    const response = await axios.request(config);
    if (response.status !== 200) {
      logMessage += `请求失败，状态码：${response.status}\n`;
      return;
    }

    const jsonData = response.data;
    if (jsonData && typeof jsonData === 'object' && jsonData.success) {
      const restTaoCoin = jsonData.data.restTaoCoin;

      logMessage += `小桃币: ${restTaoCoin}\n`;
      console.log('小桃币:', restTaoCoin);
    } else {
      logMessage += '响应数据中未包含成功标志或数据字段\n';
      console.log('响应数据中未包含成功标志或数据字段');
    }
  } catch (error) {
    logMessage += `获取小桃币失败: ${error.message}\n`;
    console.error('获取昨日积分失败:', error);
  }
}

// 购买加速卡
async function buy_goods() {
  const config = {
    method: 'GET',
    url: 'https://www.bdkjcdn.com/wapi/activity/buy_goods_single?goodsId=' + goodsId,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a1b)XWEB/9165',
      'xweb_xhr': '1',
      'kiwis-wtoken': kiwisWtoken,
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://servicewechat.com/wx003e375904180915/67/page-frame.html',
      'accept-language': 'zh-CN,zh;q=0.9'
    }
  };

  try {
    const response = await axios.request(config);
    const jsonData = response.data;
    if (jsonData.success) {
      logMessage += '加速卡购买成功\n';
      console.log('加速卡购买成功');
    } else {
      logMessage += '加速卡购买失败\n';
      console.log('加速卡购买失败');
    }
  } catch (error) {
    logMessage += `加速卡购买失败: ${error.message}\n`;
    console.log('加速卡购买失败:', error);
  }
}

// 获取购买的加速卡id
async function fetchDataAndProcessIds() {
  let config = {
    method: 'GET',
    url: 'https://www.bdkjcdn.com/wapi/user/cards',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a1b)XWEB/9165',
      'xweb_xhr': '1',
      'kiwis-wtoken': kiwisWtoken,
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://servicewechat.com/wx003e375904180915/67/page-frame.html',
      'accept-language': 'zh-CN,zh;q=0.9'
    }
  };

  try {
    const response = await axios.request(config);
    if (response.status === 200) {
      const data = response.data;
      // 检查data是否是一个对象并且有一个数据数组
      if (data && Array.isArray(data.data)) {
        for (let item of data.data) {
          const { id, cardStatus } = item;
          if (cardStatus !== '使用中') {
            await processId(id); // 在移动到下一个id之前，请在这里等待以确保完成
          } else {
            console.log(`ID ${id} 已在使用中，跳过处理`);
          }
        }
      } else {
        console.log('Expected an object with a data array but received:', data);
      }
    } else {
      console.log(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// 使用加速卡
async function processId(id) {
  const config = {
    method: 'GET',
    url: `https://www.bdkjcdn.com/wapi/user/use_card?id=${id}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a1b)XWEB/9165',
      'xweb_xhr': '1',
      'kiwis-wtoken': kiwisWtoken,
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://servicewechat.com/wx003e375904180915/67/page-frame.html',
      'accept-language': 'zh-CN,zh;q=0.9'
    }
  };

  try {
    const response = await axios.request(config);
    const { success, errorMsg } = response.data;
    if (success) {
      logMessage += `ID ${id} 使用成功: ${errorMsg}\n`; // 添加到logMessage中
      console.log(`ID ${id} 使用成功: ${errorMsg}`);
    } else {
      logMessage += `ID ${id} 使用失败: ${errorMsg}\n`; // 添加到logMessage中
      console.log(`ID ${id} 使用失败: ${errorMsg}`);
    }
  } catch (error) {
    logMessage += `ID ${id} 使用失败: ${error.message}\n`; // 添加到logMessage中
    console.error(`ID ${id} 使用失败:`, error);
  }
}

//自动提现
async function withdrawPoints() {
  let data = JSON.stringify({
    "point": point 
  });

  let config = {
    method: 'POST',
    url: 'https://www.bdkjcdn.com/wapi/financial/withdraw',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a1b)XWEB/9165',
      'xweb_xhr': '1',
      'kiwis-wtoken': kiwisWtoken,
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://servicewechat.com/wx003e375904180915/67/page-frame.html',
      'accept-language': 'zh-CN,zh;q=0.9'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    const { success, errorMsg } = response.data;
    if (success) {
      console.log('提现成功');
      logMessage += '提现成功\n';
    } else {
      console.error(`提现失败: ${errorMsg}`);
      logMessage += `提现失败: ${errorMsg}\n`;
    }
  } catch (error) {
    console.error('提现失败:', error.message);
    logMessage += `提现失败: ${error.message}\n`;
  }
}

// 主流程函数
async function main() {
  await checkIn();
  await getDeviceDetail();
  await getYesterdayPoint();
  await restTaoCoin();
  await buy_goods();
  await fetchDataAndProcessIds();
  await withdrawPoints();

  await sendLogMessage();
}

main();
