import axios from 'axios'
import Cookie from 'js-cookie'
import pg from 'path-to-regexp'
import qs from 'querystring'
import { hashHistory } from 'react-router'
import { message } from 'antd'

const API_ROOT = process.env.NODE_ENV === 'development' ? 'http://localhost:9280/api' : process.env.NODE_ENV === 'product' ? 'http://10.15.255.10:8081/api' : 'http://114.55.100.198:8081/api'

/**
 * @description 将路经编译成路由
 * @param {*} regex
 * @param {*} params
 * @private
 */
function toPath(regex, params) {
  if (Object.prototype.toString.call(params) === '[object Object]') throw new TypeError('params should be an object')
  return pg.compile(regex)(params)
}

const instance = axios.create({
  baseURL: API_ROOT,
  timeout: 300000,
  withCredentials: false,//withCredentials表示跨域请求时是否需要使用凭证
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded ;charset=utf-8'
  }
})

// request预处理请求配置
instance.interceptors.request.use(function (config) {
  //存在token
  config.headers['token'] = localStorage.getItem('token');
  return config;
}, function (error) {
  return Promise.reject(error);
})

//response全局劫持错误
instance.interceptors.response.use(function (response) {
  //对response作处理
  return response;
}, function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        message.error('请求错误(400)');
        break;
      case 401:
        message.error('您未经授权，请重新登录');
        return hashHistory.push('/login');
        break;
      case 403:
        message.error('拒绝访问(403)');
        break;
      case 404:
        // message.error('请求错误(404)');
        break;
      case 408:
        message.error('请求超时(408)');
        break;
      case 500:
        message.error('服务器错误(500)');
        break;
      case 501:
        message.error('服务未实现(501)');
        break;
      case 502:
        message.error('网络错误(502)');
        break;
      case 503:
        message.error('服务不可用(503)');
        break;
      case 504:
        message.error('网络超时(504)');
        break;
      case 505:
        message.error('HTTP版本不受支持(505)');
        break;
      default:
        message.error(`连接出错(${error.response.status})!`);
    }
  } else {
    message.error('连接服务器失败!');
  }
})

/**
 * @description 用户登录
 * @param {Object} userinfo 用戶信息
 */
export const userLogin = function (userinfo) {
  return instance.request({
    method: 'POST',
    url: '/account/login',
    data: qs.stringify(userinfo)
  })
}

/**
 * @description 获取封面信息
 * @returns {Promise}
 */
export const getCoverData = function () {
  return instance.request({
    method: 'GET',
    url: '/overview/cover-rate',
  })
}

/**
 * @description 获取首页卡片数据
 */
export const getCardsData = function () {
  return instance.request({
    method: 'GET',
    url: '/overview/all'
  })
}

/**
 * @description 获取一级菜单
 */
export const getTopMenus = function () {
  return instance.request({
    method: 'GET',
    url: '/index/subs?id=0'
  })
}

/**
 * 获取id=<id>的节点的子节点（仅包含一级子节点，不含更深层次的子节点） 当id为0时获取一级菜单
 * @param {String} id 一級菜單的id
 */
export const getSubMenus = function (id) {
  return instance.request({
    method: 'GET',
    url: `/index/subs?id=${id}`
  })
}

/**
 * 当id为0时获取整个目录的树结构，否则获取以id为根节点的树
 * @param {Number} id
 */
export const getAllMenus = function (id) {
  return instance.request({
    method: 'GET',
    url: `/index/tree?id=${id}`
  })
}

/**
 * @description 获取菜单详情的列表页
 * @param {String} cname 子菜單的cname
 */
export const getMenuDetails = function (cname, id, query) {
  return instance.request({
    method: 'GET',
    url: `/index/detail?cname=${cname}&id=${id}`,
    params: query || {}
  })
}

/**
 * 搜索分类结果
 * @param {String} keyword
 */
export const getClassSearchResults = function (keyword) {
  return instance.request({
    method: 'GET',
    url: `/search/get/classification?q=${keyword}`
  })
}

/**
 * 搜索同义词结果
 * @param {String} keyword
 */
export const getSynonymsSearchResults = function (keyword) {
  return instance.request({
    method: 'GET',
    url: `/search/synonyms?q=${keyword}`
  })
}

/**
 * 获取需求列表， 可以进行筛选
 * @param {Object} query
 */
export const getDemandsList = function (query) {
  return instance.request({
    method: 'GET',
    url: '/demand/list',
    params: query || {},
  })
}

/**
 * 创建需求
 * @param {Object} data
 */
export const createDemand = function (data) {
  return instance.request({
    method: 'POST',
    url: '/demand/create',
    data: qs.stringify(data)
  })
}
/**
 * 获取词条详情
 * @param: cname&cid&dict_word
 */
export const getDetailInfo = function (cname, cid, dict_word) {
  return instance.request({
    method: 'GET',
    url: `/index/info?cname=${cname}&cid=${cid}&dict_word=${dict_word}`
  })
}
/*
 * 列表编辑一行(插入)
 * method: post
 * json_param:
 * 当前词条的全部字段组成的json结构体
 */
export const insertWord = function (data) {
  return instance.request({
    method: 'POST',
    url: '/edit/insert ',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/*
 * 列表编辑一行(更新)
 */
export const updateWord = function (data) {
  return instance.request({
    method: 'POST',
    url: '/edit/update ',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/*
 * 列表编辑一行(删除)
 */
export const deleteWord = function (data) {
  return instance.request({
    method: 'POST',
    url: '/edit/delete ',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


/*
 *获取审核更新树形页面目录
*/
export const updateSlide = function () {
  return instance.request({
    method: 'GET',
    url: '/edit/index'
  })
}

/*
*获取更新词每个列表
*/
export const updateDetailinfo = function (class_name, pass, query) {
  return instance.request({
    method: 'GET',
    url: `/edit/logs?class_name=${class_name}&pass=${pass}`,
    params: query || {}
  })
}

/*
 文件上传入库
支持excel，word，pdf，txt
支持格式：[xls, xlsx, doc, docx, pdf, txt]
*/
export const uploadFile = function () {
  return instance.request({
    method: 'POST',
    url: '/file/upload',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/*
*获取操作记录<词库总览>
*/
export const auditHandle = function (class_name, dict_word, synonyms, pass) {
  return instance.request({
    method: 'GET',
    url: `/edit/logs?class_name=${class_name}&dict_word=${dict_word}&synonyms=${synonyms}&pass=${pass}`
  })
}

/*
*获取更新日志<词库总览>
*/
export const updateLog = function (class_name, start_time, stop_time, query) {
  return instance.request({
    method: 'GET',
    url: `/edit/logs?class_name=${class_name}&start_time=${start_time}&stop_time=${stop_time}`,
    params: query || {}
  })
}
/*
*撤销审核
*/
export const auditRevoke = function (id) {
  return instance.request({
    method: 'POST',
    url: '/edit/logs/undo',
    data: {
      id: id
    }
  })
}
/*
*恢复审核
*/
export const auditRecovery = function (id) {
  return instance.request({
    method: 'POST',
    url: '/edit/logs/redo',
    data: {
      id: id
    }
  })
}

/*
审核更新通过
*/
export const auditPass = function (id) {
  return instance.request({
    method: 'POST',
    url: '/edit/logs/audit',
    data: {
      pass: true,
      id: id
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/*
 审核更新驳回
*/
export const auditReject = function (id) {
  return instance.request({
    method: 'POST',
    url: '/edit/logs/audit',
    data: {
      pass: false,
      id: id
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/*
词库总揽列表撤销删除或保存
*/
export const editUndo = function (undoDelete) {
  return instance.request({
    method: 'POST',
    url: '/edit/undo',
    data: qs.stringify(undoDelete)
  })
}
/*
词库总揽列表恢复删除或保存
*/
export const editRedo = function (redoInfo) {
  return instance.request({
    method: 'POST',
    url: '/edit/redo',
    data: qs.stringify(redoInfo)
  })
}
/*
获取<审核更新>操作记录
*/
export const updateLogInfo = function (class_name, start_time, stop_time, query) {
  return instance.request({
    method: 'GET',
    url: `/edit/logs?class_name=${class_name}&start_time=${start_time}&stop_time=${stop_time}`,
    params: query || {}
  })
}

/*
获取<审核更新>筛选记录
*/
export const updateLogFilter = function (class_name, query) {
  return instance.request({
    method: 'GET',
    url: `/edit/logs?class_name=${class_name}`,
    params: query || {}
  })
}

/*
获取<审核更新>条件筛选记录
*/
export const filterDetailInfo = function (class_name, pass, query) {
  return instance.request({
    method: 'GET',
    url: `/edit/logs?class_name=${class_name}&pass=${pass}`,
    params: query || {}
  })
}

/*
 *获取反馈处理树形页面目录
*/
export const feedBack = function () {
  return instance.request({
    method: 'GET',
    url: '/feedback/index'
  })
}
/*
*获取反馈词列表
*/
export const feedBackList = function (class_name, query) {
  return instance.request({
    method: 'GET',
    url: `/feedback/detail?class_name=${class_name}`,
    params: query || {}
  })
}

/*
反馈列表通过或驳回信息
*/
export const operateRes = function (data) {
  return instance.request({
    method: 'POST',
    url: '/feedback/audit',
    data: qs.stringify(data)
  })
}
/*
*反馈列表搜索词性
*/
export const selectClass = function (class_name) {
  return instance.request({
    method: 'GET',
    url: `/feedback/search-class?class_name=${class_name}`
  })
}

/*
*反馈列表添加主键
*/
export const addPrimary = function (data) {
  return instance.request({
    method: 'POST',
    url: '/feedback/dict-word',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/*
*反馈列表搜索主键
*/
export const selectPrimary = function (dict_word) {
  return instance.request({
    method: 'GET',
    url: `/feedback/search-word?dict_word=${dict_word}`
  })
}

/*
  *反馈列表添加同义词
  */
export const addSynonym = function (data) {
  return instance.request({
    method: 'POST',
    url: '/feedback/synonyms',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/*
*反馈列表撤销操作
*/
export const feedBackUndo = function (data) {
  return instance.request({
    method: 'POST',
    url: '/feedback/undo',
    data: qs.stringify(data)
  })
}

/*
*反馈列表恢复操作
*/
export const feedBackRedo = function (data) {
  return instance.request({
    method: 'POST',
    url: '/feedback/redo',
    data: qs.stringify(data)
  })
}

/*
*反馈列表删除操作
*/
export const feedBackDelete = function (data) {
  return instance.request({
    method: 'POST',
    url: '/feedback/delete',
    data: qs.stringify(data)
  })
}

/*
*权限管理<授权操作>
*/
export const grantManagementList = function () {
  return instance.request({
    method: 'GET',
    url: '/account/users',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/*
*权限管理<授权操作>
*/
export const grantAction = function (email, auth) {
  return instance.request({
    method: 'GET',
    url: `/account/grant?email=${email}&auth=${auth}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/*
 *权限管理<删除操作>
*/
export const deleteRole = function (email) {
  return instance.request({
    method: 'GET',
    url: `/account/grant?email=${email}&role=user`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/*
  运行监控<获取list>
*/
export const getChartList = function () {
  return instance.request({
    method: 'GET',
    url: '/chart/index',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getChartData = function (class_index, start_time, end_time) {
  return instance.request({
    method: 'GET',
    url: `/chart/detail?class_index=${class_index}&from_date=${start_time}&to_date=${end_time}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/*
  @图表接口拆开
*/
export const getChartOne = function (class_index, chart_name, from_date, to_date) {
  return instance.request({
    method: 'GET',
    url: `/chart/detail?class_index=${class_index}&chart_name=${chart_name}&from_date=${from_date}&to_date=${to_date}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getChartTwo = function (class_index, chart_name, from_date, to_date) {
  return instance.request({
    method: 'GET',
    url: `/chart/detail?class_index=${class_index}&chart_name=${chart_name}&from_date=${from_date}&to_date=${to_date}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getChartThree = function (class_index, chart_name, from_date, to_date) {
  return instance.request({
    method: 'GET',
    url: `/chart/detail?class_index=${class_index}&chart_name=${chart_name}&from_date=${from_date}&to_date=${to_date}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getChartFour = function (class_index, chart_name, from_date, to_date) {
  return instance.request({
    method: 'GET',
    url: `/chart/detail?class_index=${class_index}&chart_name=${chart_name}&from_date=${from_date}&to_date=${to_date}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getChartFive = function (class_index, chart_name, from_date, to_date) {
  return instance.request({
    method: 'GET',
    url: `/chart/detail?class_index=${class_index}&chart_name=${chart_name}&from_date=${from_date}&to_date=${to_date}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getChartSix = function (class_index, chart_name, from_date, to_date) {
  return instance.request({
    method: 'GET',
    url: `/chart/detail?class_index=${class_index}&chart_name=${chart_name}&from_date=${from_date}&to_date=${to_date}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}