var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');

mongoose.connect('mongodb://mongoUser:bidsonme0@ds133241.mlab.com:33241/heroku_g7962z42');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static('public'));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// Set Port

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

//THIS IS THE PHOT UP
// Set The Storage Engine
// app.use(multer({
//   destination: './upload/',
//   function(fieldname, filename){
//     return filename;
//   },
// }));

// app.post('/api/photo',function(req,res){
//   var newItem = new I
// })

// // Init Upload
// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 1000000},
//   fileFilter: function(req, file, cb){
//       checkFileType(file, cb);
//   }
// }).single('myImage');

// // Check File Type
// function checkFileType(file, cb){
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if(mimetype && extname){
//       return cb(null,true);
//   } else {
//       cb('Error: Images Only!');
//   }
// }
// // Public Folder
// app.use(express.static('./public'));

// app.get('/', (req, res) => res.render('index'));

// app.post('/upload', (req, res) => {
//   upload(req, res, (err) => {
//   if(err){
//       res.render('index', {
//           msg: err
//       });
//   } else {
//       if(req.file == undefined){
//           res.render('index', {
//               msg: 'Error: No File Selected!'
//           });
//       } else {
//           res.render('index', {
//               msg: 'File Uploaded!',
//               file: `uploads/${req.file.filename}`
//           });
//       }
//   }
// });
// });