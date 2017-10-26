var BooksJSON ='{"books":[{"id":"book1","name":"The Image-Guided Surgical Toolkit","price":"0.99","url":"http://www.igstk.org/IGSTK/help/documentation.html"},{"id":"book2","name":"Abraham Lincoln","price":"19.95","url":"http://www.learnlibrary.com/abraham-lincoln/lincoln.htm"},{"id":"book3","name":"Adventures of Tom Sawyer","price":"10.50","url":"http://www.pagebypagebooks.com/Mark_Twain/Tom_Sawyer/"},{"id":"book4","name":"Catcher in the Rye","price":"22.95","url":"https://www.goodreads.com/book/show/5107.The_Catcher_in_the_Rye"},{"id":"book5","name":"The Legend of Sleepy Hollow","price":"15.99","url":"http://www.learnlibrary.com/sleepy-hollow/sleepy-hollow.htm"},{"id":"book6","name":"Moby Dick","price":"24.45","url":"https://www.amazon.com/Moby-Dick-Herman-Melville/dp/1503280780"},{"id":"book7","name":"Java Programming 101","price":"12.95","url":"https://www.javaworld.com/blog/java-101/"},{"id":"book8","name":"Robinson Crusoe","price":"11.99","url":"http://www.learnlibrary.com/rob-crusoe/"},{"id":"book9","name":"The Odyssey","price":"32.00","url":"http://classics.mit.edu/Homer/odyssey.html"}]}'

var BooksJSONObject = JSON.parse(BooksJSON);

var express = require('express');
    ejs = require('ejs');
var app = express();
app.set('views', './views');
app.engine('html', ejs.renderFile);
app.listen(8080);

var cookieParser = require('cookie-parser');
var session = require('express-session');

var bodyParser = require('body-parser')
//app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({   
  extended: true
}));

app.use(session({
	secret: 'MAGICALEXPRESSKEY',
	resave: true,
	saveUninitialized: true
}));

bookData = new Array();
namePrice = {};
var userdata = {};

for (var i=0; i<BooksJSONObject.books.length;i++){
  namePrice[BooksJSONObject.books[i].name] = BooksJSONObject.books[i].price;
  bookData.push([BooksJSONObject.books[i].name,
                 BooksJSONObject.books[i].price,
                 BooksJSONObject.books[i].url]);
}

app.use('/',function(req, res, next) { 
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
 
app.get('/landing', function (req, res) {
  app.render('landing.html', function(err, renderedData){
    res.send(renderedData);
  });  
});

app.locals.invalidinput = false;
app.locals.authfailure = false;
app.locals.missinginput = false;
app.locals.missingusername = false;
app.locals.missingpassword = false;
app.locals.invalidinput1 = false;
app.locals.authfailure1 = false;
app.locals.missinginput1 = false;
app.locals.missingusername1 = false;
app.locals.missingpassword1 = false;
app.locals.missingname = false;
app.locals.missingprice = false;
app.locals.missingurl = false;
app.locals.bookadd = false;
app.locals.bookdelete = false;
app.locals.missingselectname = false;

app.get('/admin', function (req, res) {
  app.render('admin.html', function(err, renderedData){
    res.send(renderedData);
  });  
});

app.post('/loggedadmin', function (req, res) {
  if (req.body.checklogin1 == 'Yes' ){
    if(req.body.name && req.body.pwd){
        app.locals.missinginput1 = false;
        app.locals.missingusername1 = false;
        app.locals.missingpassword1 = false;
        if((req.body.name == req.body.pwd) && req.body.pwd == "admin"){
            app.locals.authfailure1 = false;
            req.session.restricted = true;
            app.locals.missinginput = false;
            app.locals.invalidinput = true;
            app.locals.bookadd = false;
            app.locals.bookdelete = false;
            app.render('loggedadmin.html', function(err, renderedData){
            res.send(renderedData);
            });
        }
        else{
            app.locals.missinginput1 = false;
            app.locals.missingusername1 = false;
            app.locals.missingpassword1 = false;
            app.locals.authfailure1 =  true; 
            res.redirect('/admin');     
        }}
     else if(req.body.name){
            app.locals.missinginput1 = false;
            app.locals.missingusername1 = false;
            app.locals.missingpassword1 = true; 
            app.locals.authfailure1 = false;
            res.redirect('/admin');
        }else if (req.body.pwd){
            app.locals.missinginput1 = false;
            app.locals.missingusername1 = true;
            app.locals.missingpassword1 = false; 
            app.locals.authfailure1 = false; 
            res.redirect('/admin');        
        }
      else{
            app.locals.missinginput1 = true;
            app.locals.missingusername1 = false;
            app.locals.missingpassword1 = false; 
            app.locals.authfailure1 = false;  
            res.redirect('/admin');
      }
    }
    else {
      res.redirect('/landing');
       }
});

app.post('/addbook', function (req, res) {
if(req.session.restricted){
  if(req.body.name && req.body.price && req.body.url){
      app.locals.missingname = false;
      app.locals.missingprice = false;
      app.locals.missingurl = false; 
      app.locals.bookdelete = false;
      app.locals.missingselectname = false;
      namePrice[req.body.name] = req.body.price;
      bookData.push([req.body.name,req.body.price,req.body.url]);          
      app.locals.bookadd = true;
      app.render('loggedadmin.html', function(err, renderedData){
      res.send(renderedData);
    });
  }
    else if(!req.body.name){
        app.locals.missingname = true;
        app.locals.missingprice = false;
        app.locals.missingurl = false;
        app.locals.bookadd = false;
        app.locals.bookdelete = false;
        app.locals.missingselectname = false;
        app.render('loggedadmin.html', function(err, renderedData){
        res.send(renderedData);
        });
    }else if(!req.body.price){
        app.locals.missingname = false;
        app.locals.missingprice = true;
        app.locals.missingurl = false; 
        app.locals.bookadd = false;
        app.locals.bookdelete = false;
        app.locals.missingselectname = false;
        app.render('loggedadmin.html', function(err, renderedData){
        res.send(renderedData);
        });             
    }else{
        app.locals.missingname = false;
        app.locals.missingprice = false;
        app.locals.missingurl = true; 
        app.locals.bookadd = false;
        app.locals.bookdelete = false;
        app.locals.missingselectname = false;
        app.render('loggedadmin.html', function(err, renderedData){
        res.send(renderedData);
        });        
    }
  }
  else {
    res.redirect('/landing');
  }  
});

app.post('/deletebook', function (req, res) {
if(req.session.restricted){
  if(req.body.Book){
      app.locals.missingname = false;
      app.locals.missingprice = false;
      app.locals.missingurl = false; 
      app.locals.bookadd = false;
      app.locals.missingselectname = false;   
      bookData.pop([req.body.Book,req.body.price,req.body.url]);         
      app.locals.bookdelete = true;
      app.render('loggedadmin.html', function(err, renderedData){
      res.send(renderedData);
    });
  }else{
        app.locals.missingselectname = true;
        app.locals.missingname = false;
        app.locals.missingprice = false;
        app.locals.missingurl = false; 
        app.locals.bookadd = false;
        app.locals.bookadd = false;
        app.locals.bookdelete = false;
        app.render('loggedadmin.html', function(err, renderedData){
        res.send(renderedData);
        });        
    }
  }
  else {
    res.redirect('/landing');
  }  
});


app.get('/login.html', function (req, res) {
req.session.restricted = true;
  app.render('login.html', function(err, renderedData){
    res.send(renderedData);
  });  
});

app.post('/login', function (req, res) {
  if ( req.session.restricted ){  
    if(req.body.name && req.body.pwd){
        app.locals.missinginput = false;
        app.locals.missingusername = false;
        app.locals.missingpassword = false;
        if(req.body.name == req.body.pwd){
            app.locals.authfailure = false;
            if (userdata[req.body.name] !=  undefined){
              req.session.username = req.body.name;
              app.render('askToContinue.html', function(err, renderedData){
              res.send(renderedData);
                });
            }
            else {
              req.session.username = req.body.name;
              var input = {};
              input['username'] =  req.session.username;
              
              userdata[req.session.username] = new Array();

              app.render('loggedIn.html', input, function(err, renderedData){
                res.send(renderedData);
              });
        }
        }
        else{
            app.locals.missinginput = false;
            app.locals.missingusername = false;
            app.locals.missingpassword = false;
            app.locals.authfailure =  true; 
            res.redirect('/login.html');     
        }}
     else if(req.body.name){
            app.locals.missinginput = false;
            app.locals.missingusername = false;
            app.locals.missingpassword = true; 
            app.locals.authfailure = false;
            res.redirect('/login.html');
        }else if (req.body.pwd){
            app.locals.missinginput = false;
            app.locals.missingusername = true;
            app.locals.missingpassword = false; 
            app.locals.authfailure = false; 
            res.redirect('/login.html');        
        }
      else{
           app.locals.missinginput = true;
            app.locals.missingusername = false;
            app.locals.missingpassword = false; 
            app.locals.authfailure = false;  
            res.redirect('/login.html');
      }
    }
    else {
      res.redirect('/landing');
       }
});


app.post('/askToContinue', function (req, res) {
  
  var preference = req.body.check;
  if (preference == 'yes'){
    req.session.restricted = true;
    if (userdata[req.session.username][0] == '/purchase'){      
      var input = {}; 
      input['Cart'] = userdata[req.session.username][1];
      input['TotalPrice'] = userdata[req.session.username][2];
      input['username'] =  req.session.username;
      app.render('purchase.html', input, function(err, renderedData){
        res.send(renderedData);
      });
    }
    else if (userdata[req.session.username][0] == '/list'){
      var input = {};
      input['username'] =  req.session.username;
        app.render('list.html', input, function(err, renderedData){
        res.send(renderedData);
      });
  }
  }
  else {
    userdata[req.session.username] = undefined;
    app.render('loggedIn.html', function(err, renderedData){
      res.send(renderedData);
    });
  }
});

app.get('/list', function (req, res) {  
  if(req.session.restricted){      
  var input = {};
 if(req.session.username == undefined) {
     input['username'] = "admin";  
     req.session.username = "admin";
     userdata['admin'] = new Array();
 }
 else
   input['username'] =  req.session.username;
      
    app.locals.missinginput = false;
    app.locals.invalidinput = false;
    app.render('list.html', input, function(err, renderedData){    
    res.send(renderedData);
    });  
  }
  else {
    res.redirect('/landing');
  }
});

app.post('/purchase', function (req, res) {
if(req.session.restricted){
  if(req.body.Quantity && req.body.Book){
      app.locals.missinginput = false;
      if(Number(req.body.Quantity) || req.body.Quantity == '0'){
          app.locals.invalidinput = false;           
          var bookarray = new Array();          
          if (typeof req.body.Book == 'object' ){
              bookarray = req.body.Book;
          }
          else{
              bookarray.push(req.body.Book);
          }
          
          var cart = new Array();
          var totalPrice = 0;
          var quantity = req.body.Quantity;

          for(var i=0; i<bookarray.length;i++){
            var currentBook = bookarray[i];
            var currentBookPrice= (namePrice[currentBook] * quantity).toFixed(2);
            totalPrice += Number(currentBookPrice);
            cart.push([currentBook,quantity,namePrice[currentBook],currentBookPrice]);
          }
          totalPrice = totalPrice.toFixed(2);
          
          if (userdata[req.session.username][1] == undefined && userdata[req.session.username][2] == undefined){          
            req.session.shoppingCart = cart;
            req.session.TotalPrice = totalPrice;
            userdata[req.session.username][1] = cart;
            userdata[req.session.username][2] = totalPrice;
          }
          else {
            req.session.shoppingCart = userdata[req.session.username][1];
            req.session.TotalPrice = userdata[req.session.username][2];
          }  
          var input = {};         
          input['Cart'] = req.session.shoppingCart;
          input['TotalPrice'] = req.session.TotalPrice;
          input['username'] =  req.session.username;
          app.render('purchase.html', input, function(err, renderedData){
          res.send(renderedData);
        });
        }
      else{
          app.locals.missinginput = false;
          app.locals.invalidinput = true; 
          res.redirect('/list');   
      }
  }
    else
        {
        app.locals.invalidinput = false; 
        app.locals.missinginput = true; 
        res.redirect('/list');
    }
  }
  else {
    res.redirect('/landing');
  }  
});

app.get('/checkLogout', function (req, res) {
  var ref = req.headers.referer;
  if (userdata[req.session.username][0] == undefined){
    if (ref.includes('purchase')){
      req.session.page = '/purchase';
    }
    else if (ref.includes('list')){
      req.session.page = '/list';
    }    
    userdata[req.session.username][0] = req.session.page;
  }
  else {
    req.session.page = userdata[req.session.username][0];
  }
  res.redirect('/landing');
});

app.get('/checkFinalLogout', function (req, res) {  
  userdata[req.session.username] = undefined;
  res.redirect('/landing');
});


app.post('/confirm', function (req, res) {
  if(req.session.restricted){
    if (userdata[req.session.username][3] == undefined && userdata[req.session.username][4] == undefined && userdata[req.session.username][5] == undefined){
      req.session.Creditcard = req.body.Creditcard;
      req.session.Cardnumber = req.body.Cardnumber;
      userdata[req.session.username][3] = req.body.Creditcard;
      userdata[req.session.username][4] = req.body.Cardnumber;

      if (req.body.expressdelivery == 'on'){
        req.session.expressdelivery = 'Yes';
      }
      else {
        req.session.expressdelivery = 'No';
      }
      userdata[req.session.username][5] = req.session.expressdelivery;
    }
    else {
      req.session.Creditcard = userdata[req.session.username][3];
      req.session.Cardnumber = userdata[req.session.username][4];
      req.session.expressdelivery = userdata[req.session.username][5];
    }
    
    var input = {};
    input['Creditcard'] =  req.session.Creditcard;
    input['Cardnumber'] =  req.session.Cardnumber ;
    input['username'] =  req.session.username ;
    input['TotalPrice'] =  req.session.TotalPrice ;
    input['expressdelivery'] =  req.session.expressdelivery ;
    req.session.page = undefined;
    req.session.shoppingCart = undefined;

    app.render('confirm.html', input, function(err, renderedData){
      res.send(renderedData);
    });
    
  }
  else {
    res.redirect('/landing');
  }
});

app.get('/purchase', function (req, res) {
  req.session.restricted = false;
  res.redirect('/landing');
});
app.get('/login', function (req, res) {
    req.session.restricted = false;
    res.redirect('/landing');  
});

app.get('*', function(req, res){
  res.send('404 Not Found', 404);
});

app.all('*', function(req, res){
  res.send('405 Method Not Implemented.', 405);
});