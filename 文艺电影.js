var cheerio = require('cheerio')
// 引入自己的模块
var log = require('./utils').log
var cached_url = require('./utils').cached
var utils = require('./utils')

// 电影类
class Movie {
    constructor() {
        // 分别是电影名/评分/评价人数/封面图片链接
        this.name = ''
        this.score = 0
        this.ratings = ''
        this.coverUrl = ''
    }
}

// 创建一个电影类的实例并获取数据
var movieFromDiv = function(div) {
    // cheerio.load 用来把 HTML 文本解析为一个可以操作的 DOM
    var e = cheerio.load(div)
    var movie = new Movie()

    // 切除电影名中的无关内容
    var name = e('.pl2').find('a').last().text()
    movie.name = name.replace(/\n/g, '').replace(/ /g, '').replace(/\//g, ' / ')

    movie.score = e('.rating_nums').text()

    var ratings = e('.star').find('span').last().text()
    movie.ratings = ratings.slice(1, -1)

    var pic = e('.nbg')
    movie.coverUrl = pic.find('img').attr('src')

    return movie
}

var moviesFromUrl = function(url) {
    var e = cheerio.load(body)
    // 缓存数据
    var body = cached_url(url)
    var e = cheerio.load(body)
    // 使用选择器操作 cheerio 返回的对象
    var movieDivs = e('.item')
    // 循环处理当前页面所有的 .item
    var movies = []
    for (var i = 0; i < movieDivs.length; i++) {
        var div = movieDivs[i]
        var m = movieFromDiv(div)
        movies.push(m)
    }
    return movies
}

var downloadCovers = function(movies) {
    var request = require('request')
    var fs = require('fs')
    for (var i = 0; i < movies.length; i++) {
        var m = movies[i]
        var url = m.coverUrl
        var path = 'images/' + m.name.split('/')[0] + '.jpg'
        request(url).pipe(fs.createWriteStream(path))
    }
}

var __main = function() {
    var movies = []
    // 以爬取前 10 页为例
    for (var i = 0; i < 10; i++) {
        var start = i * 25
        var url = 'https://movie.douban.com/tag/%E6%96%87%E8%89%BA?start=' + start
        var ms = moviesFromUrl(url)
        // 把 ms 数组里面的元素都添加到 movies 数组中
        movies = movies.concat(ms)
    }
    utils.save('文艺电影.json', movies)
    downloadCovers(movies)
}

__main()
