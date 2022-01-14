# WordExtractTranslate

## Description

> 对指定文件夹中指定文件类型的文件内容 进行 简体中文提取
> 与指定表格中的简体中文对比，表格中没有的就加上
> 合并结果倒序排列
> 对于没有对应繁体中文的简体中文，自动翻译出繁体中文

## Setup

```bash
# install dependencies
yarn install

# 修改要替换的文件类型: src/index.js

# 不处理的环境路径
const exclude = ['node_modules', '.history']
# 需要处理的文件路径
const exclude = ['dist', 'src']
# 需要处理的文件类型
const types = ['js', 'vue', 'html']

# 替换目标文件夹下指定文件类型的简体中文
yarn start 1(是否繁=>简|选填|默认: 0简=>繁)
```

## Locale Excel
| 简体中文   | 繁体中文  |  English  |
| --------  |  :-----:   | :----:  |
|  页面      |   頁麵   |   Page   |
