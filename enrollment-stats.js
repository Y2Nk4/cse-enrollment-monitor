const got = require('got')
const cheerio = require('cheerio')
const config = require('./config')
const csvStringify = require('csv-stringify/sync')
const fs = require('fs')


module.exports = async () => {
    let resp
    resp = await got.get('https://engineering.buffalo.edu/computer-science-engineering/undergraduate/courses/course-enrollments.external.html')
    if (/name="CFC__target" value="([^"]*)">/.test(resp.body)) {
        let cfcTarget = /name="CFC__target" value="([^"]*)">/.exec(resp.body)[1]
        resp = await got.post('https://engineering.buffalo.edu/computer-science-engineering/undergraduate/courses/course-enrollments.external.html', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
                'referer': 'https://engineering.buffalo.edu/computer-science-engineering/undergraduate/courses/course-enrollments.external.html',
            },
            form: {
                CFC__target: cfcTarget,
                termsourcekey_param: config.current_term,
                my_submit: 'Submit'
            }
        })

        let $ = cheerio.load(resp.body)
        const rows = $('#middle_section table tbody tr')
        let data = []
        for(let i = 1; i < rows.length; i++) {
            let row = $(rows[i]).find('td')
            data.push({
                course_number: $(row[0]).text(),
                title: $(row[1]).text(),
                instructor: $(row[2]).text(),
                type: $(row[3]).text(),
                credit_hrs: $(row[4]).text(),
                days: $(row[5]).text(),
                times: $(row[6]).text(),
                reserved_majors: $(row[7]).text(),
                enrolled: $(row[7]).text(),
            })
        }
        console.log(data)
        fs.writeFileSync(`./data/enrollment/${(new Date().toUTCString())}.csv`, csvStringify.stringify(data, {
            header: true,
        }))

    } else {
        console.log(resp.body)
        console.log('failed')
    }
}
