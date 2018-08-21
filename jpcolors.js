var cheerio = require('cheerio')
// 引入自己的模块
var log = require('./utils').log
var cached_url = require('./utils').cached
var utils = require('./utils')

// 电影类
class Color {
    constructor() {
        // 分别是电影名/评分/评价人数/封面图片链接
        this.name = ''
        this.jpcolor = ''
    }
}

// 创建一个电影类的实例并获取数据
var colorFromDiv = function(div) {
    // cheerio.load 用来把 HTML 文本解析为一个可以操作的 DOM
    var e = cheerio.load(div)
    var color = new Color()

    var name = e('a').text().split('#')[0]
	// color.name = name.replace(/\n/g, '').replace(/ /g, '').replace(/\//g, ' / ')
	// console.log(color.name);
    color.name = name

    var jpcolor = e('a').find('span').text()
	color.jpcolor = jpcolor

    return color
}

var colorsFromUrl = function(url) {
    // 缓存数据
    var body = cached_url(url)
    var e = cheerio.load(body)
    // 使用选择器操作 cheerio 返回的对象
    var colorDivs = e('#japancolor .white')
    // 循环处理当前页面所有的 .item
    var colors = []
    for (var i = 0; i < colorDivs.length; i++) {
        var div = colorDivs[i]
        var c = colorFromDiv(div)
        colors.push(c)
    }
    return colors
}

var __main = function() {
    var colors = []
    // // 以爬取前 10 页为例
    // for (var i = 0; i < 10; i++) {
    //     var start = i * 25
    var url = 'https://www.sojson.com/web/cj.html'
    var cs = colorsFromUrl(url)
    // 把 ms 数组里面的元素都添加到 movies 数组中
    colors = colors.concat(cs)
    // }
	// console.log(cs);
    utils.save('jpcolors.json', colors)
}

__main()
