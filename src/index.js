const path = require('path')
const xlsx = require('node-xlsx');
const fs = require('fs');
const Common = require('./utils/utils')
const { info } = require('./utils/log');


const LOCALE_FILE = 'source file.xlsx'
const sheets = xlsx.parse(`./${LOCALE_FILE}`);

//^[\u2E80-\u9FFF]+$ 匹配所有东亚区的语言
//^[\u4E00-\u9FFF]+$ 匹配简体和繁体
//^[\u4E00-\u9FA5]+$ 匹配简体
const regx = /[\u4E00-\u9FA5]/

// const dirPath = process.argv[2]
// 是否繁体转简体，默认0：简体转繁体
const transType = process.argv[2] || 0

// 不处理的环境路径
const exclude = ['node_modules', '.history']
// 需要处理的文件路径
const dirPaths = ['dist']
//指定要替换的文件类型
const types = ['js', 'vue', 'html']

if (!dirPaths || !dirPaths[0]) {
  console.log('文件路径不能为空'.yellow)
  return
}


//获取到所有需要替换的文件
writeNewExcel(dirPaths)

async function writeNewExcel(dirPaths) {
  const list = await getWriteData(dirPaths)

  var finalData = 
      [{
        name: '国际化翻译',
        data:
          [
            [
              'Simplified Chinese',
              'Traditional Chinese',
              'English'
            ],
          ...list
          ]
      }]
  
  try {
    await writeExcel(finalData)
    // await Common.writeFile(filePath, result)
  } catch (e) {
    info(`文件替换发生错误[${LOCALE_FILE}] : ${e.toString()}`)
  }
}

async function getWriteData(dirPaths) {
  let words = []

  let fileWords = await readFilesData(dirPaths)
  let excelWords = readExcelData()

  fileWords.forEach(e => {
    const wordObj = excelWords[e] || {'Simplified Chinese':'', 'Traditional Chinese':'', 'English':''}
    words.push([
      e,
      wordObj['Traditional Chinese'] || tranformCC(e),
      wordObj['English']
    ])
  });
  return words
}

async function readFilesData(dirPaths) {
  let words = []
  for (let dp of dirPaths) {
    const res = await mapFiles(dp)
    words = words.concat(res)
  }

  if (0 === words.length) {
    return []
  }

  words = unique(words)
  sortChinese(words)
  return words
}

function readExcelData() {
  let res = { } // { 简体中文: {'Simplified Chinese':'','Traditional Chinese':'','English':''} }
  //sheets是一个数组，数组中的每一项对应test.xlsx这个文件里的多个表格，如sheets[0]对应test.xlsx里的“测试参数”这个表格，sheets[1]对应Sheet2这个表格
  sheets.forEach(function(sheet){
    //sheet是一个json对象，格式为{name:"标签名",data:[]},我们想要的数据就存储在data里
    for(var i=1; i<sheet["data"].length; i++){ //excel文件里的表格一般有标题所以不一定从0开始
        var row = sheet['data'][i];
        if(row && row.length > 0){
            res[row[0] && row[0].trim()] =
              {
                  'Simplified Chinese': row[0] && row[0].trim(), //去除文本前后空格，要去除
                  'Traditional Chinese': row[1] && row[1].trim(), //row[1]对应表格里C这列
                  'English': row[2] && row[2].trim(),
              }
        }
    }
  });
  return res
}

function mapFiles(dirPath) {
  return new Promise(async function(resolve, reject) {
    let data = []
    const res = await Common.stat(dirPath)
    //不是文件夹就进入改变文件
    if (!res.isDir) {
      const words = await getFileWords(res.filePath)
      data = data.concat(words)
    } else {
      if (exclude.includes(dirPath.replace(/(.*\\)(.*$)/, '$1'))) {
        return Promise.resolve([])
      }
      
      const files = await Common.readdir(dirPath)
      const arr = files.map(async item => {
        const res = await Common.stat(path.resolve(dirPath, item))
        return Promise.resolve(res)
      });
      //获取到目录里所有文件及其类型
      const result = await Promise.all(arr);
      for (let item of result) {
        const words = await mapFiles(item.filePath)
        data = data.concat(words)
      }
    }
    resolve(data)
  })
}

//解析一个文件
function getFileWords(filePath) {
  return new Promise(async function(resolve, reject) {
    const ext = filePath.slice(filePath.lastIndexOf('.') + 1).toLocaleLowerCase()
  
    //不是需要解析的文件后缀，直接返回空数组
    if (!types.includes(ext)) resolve([])
  
    //获取文件内容
    const res = await Common.readFile(filePath)
    // 提取中文数组
    const arr = res.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '').match(/[\u4e00-\u9fa5]{1,}/g) || []
    
    resolve(arr)
  })
}

// 数组去重
function unique(arr) {
  return Array.from(new Set(arr))
}
// 中文排序
function sortChinese(arr) { // 参数： 排序的数组
  arr.sort(function (item1, item2) {
    return item1.localeCompare(item2, 'zh-CN');
  })
}

//获取转换一个文件的中文简体到繁体
function tranformCC(str) {
  //这个文件有一个中文才去遍历替换,优化性能
  if (!regx.test(str)) {
    return str
  }
  // console.log('match >>> ', str.match(/[\u4E00-\u9FA5]{1,}/g))

  return Array.prototype.map.call(str, item => {
    if (regx.test(item)) {
      item = Common.tranformCC(item, 0)
    }
    return item
  }).join('')
}


function writeExcel(data) {
  var buffer = xlsx.build(data);

  // 写入文件
  fs.writeFile(LOCALE_FILE, buffer, function(err) {
    if (err) {
        console.log("Write failed: " + err);
        return;
    }

    console.log("Write completed.");
  });
}