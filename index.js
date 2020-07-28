const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser


const movies = ["https://www.imdb.com/title/tt8110330/?ref_=hm_fanfav_tt_1_pd_fp1",
                "https://www.imdb.com/title/tt6048922/?ref_=hm_fanfav_tt_4_pd_fp1",
                "https://www.imdb.com/title/tt4169250/?ref_=hm_fanfav_tt_6_pd_fp1"];


// ( () => {})();

(async() => {
    let imdbData = []

    for(let movie of movies) {
        const response = await request({
            uri: movie,
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "th-TH,th;q=0.9,en;q=0.8"
            },
            gzip: true
        });

        let $ = cheerio.load(response)
        let title = $('div[class="title_wrapper"] > h1').text().trim()
        let rating = $('div[class="ratingValue"] > strong > span').text()
        let summary = $('div[class="summary_text"]').text().trim()
        let releaseDate = $('a[title="See more release dates"]').text().trim()
        // the more constant you have the easier life it is

        /*imdbData.push({
            title: title,
            rating: rating,
            summary: summary,
            releaseDate: releaseDate
        })*/
        imdbData.push({
            title,
            rating,
            summary,
            releaseDate
        });
    }
    const json2csvparser = new json2csv()
    const csv = json2csvparser.parse(imdbData)

    fs.writeFileSync("./imdb.csv", csv, "utf-8");

})();