// Scrape InvestiQuant Blog to capture data and post it to Notion table.
const cheerio = require('cheerio');

// What URLs to scrape..
const urls = [
    /// URLZZZZ
]

const notionDBID = '';
const notionAuthToken = '';


// Get the data....
const request = require('request');

for (i=0; i< urls.length; i++) {
    const options = {
        method: 'GET',
        url: urls[i],
       
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const $ = cheerio.load(body);
        
        let title = $('.theme-single-blog-heading').text();
        let day = $('.zptext div div p:nth-child(1)').text().substring(6,15).trim();
        console.log(day);
        let gap = $('.zptext div div p:nth-child(2)').text().substring(23,28).trim();
        if (gap.length < 1) {
            gap = "N/A"
        }
        let status = $('.zptext div div p:nth-child(3)').text().substring(15,100).trim();
        let setup = $('.zptext div div p:nth-child(5)').text().substring(15,21).trim();
        let trend = $('.zptext div div p:nth-child(6)').text().substring(14,20).trim();
        let result = $('.zpimage').attr('src');
      
        //Notion
          const notionoptions = {
          method: 'POST',
          url: 'https://api.notion.com/v1/pages',
          headers: {
              Authorization: notionAuthToken,
              'Content-Type': 'application/json'
          },
          body: {
              parent: {database_id: notionDBID},
              properties: {
                  Name: {title: [{text: {content: title}}]},
                  Day: {select: {name: day}},
                  Gap: {select: {name: gap}},
                  Status: {
                      "rich_text": [
                      {
                          "type": "text",
                          "text": {
                          "content": status
                          }
                      },
                      ]
                      },
                  Setup: {select: {name: setup}},
                  Trend: {select: {name: trend}},
                  OP: {"url": options.url},
                  // Until notion gets their shit together...
                  TempIMG: {"url": "https://www.investiquant.com" + result}
              }
          },
          json: true
          };
      
          request(notionoptions, function (error, response, body) {
          if (error) throw new Error(error);
      
          console.log(body);
          });
      
      
      
      });
      
}