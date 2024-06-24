/*
------------------------------------------
@Author: 老罗 2050768976
@Date: 2024.06.24 19:47
@Description: 本电科技每日签到 和设备详情
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

let logMessage = ''; // 该处默认即可

// 通过post访问cq机器人的发送系统
async function sendLogMessage() {
  const url = 'http://10.10.10.26:5700/send_private_msg';//自己cq机器人的地址
  const data = {
    user_id: userId,
    message: logMessage.trim() // Trim any leading/trailing whitespace
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

// 用于编排流程的 Main 函数
async function main() {
  await checkIn();
  await getDeviceDetail();
  await getYesterdayPoint();
  await restTaoCoin();

  // 完成所有 API 调用后，发送累积的日志消息
  await sendLogMessage();
}

main();
