const {
  s,
  t
} = require('./lang');

const fs = require('fs')

class Common {
  /**
   *
   * @param {*} str 要替换的字符串
   * @param {*} type 替换的类型, 0: 简体=>繁体 1:繁体=>简体
   */
  static tranformCC(str, type = 0) {
    const tmp = [s, t]
    const data = type ? tmp.reverse() : tmp

    const source = data[0]
    const target = data[1]
    const index = source.indexOf(str)
    return index === -1 ? str : target[index] || str
  }

  static stat = path => new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err)
        return
      }
      stats.isDir = stats.isDirectory()
      stats.isFile = stats.isFile()
      stats.filePath = path
      resolve(stats)
    })
  })

  static readdir = path => new Promise((resolve, reject) => {
    fs.readdir(path, {}, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve(files)
    })
  })

  static readFile = path => new Promise((resolve, reject) => {
    fs.readFile(path, {
      encoding: 'utf-8'
    }, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })

  static writeFile = (path, data) => new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    });
  })

}
module.exports = Common