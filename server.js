const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const Webflow = require('webflow-api');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

// Initialize the API
const api = new Webflow({ token: '06b555feedd3c4eaa17899dc043b26309925af48eb448e2eb4f25fb2bbaf8611' });
var page_count = 1;
var total_pages = 0;
var offset = 0;
var count = 0;

app.get('/', function (req, res) {
  let getCollections = function() {
    return api.items({ collectionId: '5b8d5ccbcbd055b63724f24d'}, {offset: 0, limit: 10});
  }

  let items = getCollections()

  items.then(function(result) {
     //console.log(result) //will log results. 
     page_count = 1
     total_pages = Math.ceil(result['total']/10)
     count = result['count']
     data = result['items'] 
     res.render('index', {page_count, total_pages, count, data})
  })
})

app.post('/', function (req, res) {
  if (req.body.req_type == 'nxt') {
  	page_count += 1;
  	offset += 10;
  } else if (req.body.req_type == 'prv') {
  	page_count -= 1;
  	offset -= 10;
  }
  let getCollections = function() {
    return api.items({ collectionId: '5b8d5ccbcbd055b63724f24d'}, {offset: offset, limit: 10});
  }

  let items = getCollections()

  items.then(function(result) {
     total_pages = Math.ceil(result['total']/10)
     count = result['count']
     data = result['items']
     res.render('index', {page_count, total_pages, count, data})
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})