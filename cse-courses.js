const got = require('got')
const cheerio = require('cheerio')
const config = require('./config')
const csvStringify = require('csv-stringify/sync')
const fs = require('fs')


;(async () => {
    let resp
    let page = 1
    let info = [true, false, true]
    let data = []

    while(/showing (\d*) to (\d*)/.test(resp.body) && info[1] !== info[2]) {
        resp = await got.post('https://catalog.buffalo.edu/courses/index.php', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
                'referer': 'https://engineering.buffalo.edu/computer-science-engineering/undergraduate/courses/course-enrollments.external.html',
            },
            form: {
                page,
                abbr: 'CSE',
                keyword: '',
                num: '',
            }
        })
        info = /showing (\d*) to (\d*)/.exec(resp.body)
        page++

        let $ = cheerio.load(resp.body)


        let courseTitle = (/(CSE (\d*))([^ ]*) (.*)/).exec()
        data.push({

        })
    }



})()
