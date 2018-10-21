const toString = Object.prototype.toString

/**
 * 判断对象是否是数组
 * @param {Object} val 
 * @returns {boolean} true 就是数组
 */
export function isArray (val) {
  return toString.call(val) === '[object Array]'
}

