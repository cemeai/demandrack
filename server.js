const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const Webflow = require('webflow-api');
var fs = require('fs');
var $ = jQuery = require('./node_modules/jquery/dist/jquery.min.js');
//var $ = jQuery = require('jQuery');
require('./node_modules/jquery-csv/src/jquery.csv.js');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.set('view engine', 'ejs')

// Initialize the API
const api = new Webflow({ token: '06b555feedd3c4eaa17899dc043b26309925af48eb448e2eb4f25fb2bbaf8611' });
var page_count = 1;
var total_pages = 0;
var offset = 0;
var count = 0;
var sear = 0;
var dw = './csv/demandrack_warehouses.csv';

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
     offs = 0
     sear = 0
     res.render('index', {page_count, total_pages, count, data, sear, offs})
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
     offs = 0
     sear = 0
     res.render('index', {page_count, total_pages, count, data, sear, offs})
  })
})

app.post('/search', function (req, res) {
  if (req.body.req_type == 'snxt') {
    page_count += 1;
    count += 10;
    offs += 10;
    param = req.app.get('search_string');
  } else if (req.body.req_type == 'sprv') {
    page_count -= 1;
    offs -= 10;
    count -= 10;
    param = req.app.get('search_string');
  } else {
    param = req.body.loct.toLowerCase();
    page_count = 1;
    count = 10;
    offs = 0
    app.set('search_string', param);
  }
  fs.readFile(dw, 'UTF-8', function (err, csv) {
    if (err) { console.log(err); }
    let results = $.csv.toObjects(csv);
    let data = results.filter(result => result.city.toLowerCase() == param);
    total_pages = Math.ceil(Object.keys(data).length/10);
    sear = 1;
    console.log(count);
    if (page_count == total_pages) {
      count -= 10;
      count += Object.keys(data).length%10;
    } else if((count%10) != 0) {
      count -= Object.keys(data).length%10;
      count += 10;
    }
    res.render('index', {page_count, total_pages, count, data, sear, offs});
  });
})

<<<<<<< HEAD
app.get('/query', function(req, res) {
  search = req.query.loct.toLowerCase();
  offset = parseInt(req.query.offset);
>>>>>>> 2a479258babf8be2c84e84803ea062a471389390
  fs.readFile(dw, 'UTF-8', function (err, csv) {
    if (err) { console.log(err); }
    let results = $.csv.toObjects(csv);
    let items = results.filter(result => result.city.toLowerCase() == search);
    total = Object.keys(items).length;
    let data = {
      'items': items.slice(offset, offset+10),
      'total_items': total,
      'current_page': (offset/10)+1,
      'total_pages': Math.ceil(total/10),
      'offset': offset,
    }
    res.json(data);
  });
});

// Modify by Cesar
app.post('/query', function(req, res) {
<<<<<<< HEAD
  search = req.body.loct.toLowerCase();
  offset = parseInt(req.body.offset);
>>>>>>> 2a479258babf8be2c84e84803ea062a471389390
  fs.readFile(dw, 'UTF-8', function (err, csv) {
    if (err) { console.log(err); }
    let results = $.csv.toObjects(csv);
    let items = results.filter(result => result.city.toLowerCase() == search);
<<<<<<< HEAD
    total = Object.keys(items).length;
    let data = {
      'items': items.slice(offset, offset+10),
      'total_items': total,
      'current_page': (offset/10)+1,
      'total_pages': Math.ceil(total/10),
      'offset': offset,
    }
    res.json(data);
>>>>>>> 2a479258babf8be2c84e84803ea062a471389390
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
