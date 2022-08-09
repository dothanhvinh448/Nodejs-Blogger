var express = require('express');
var router = express.Router();
var MyPost = require('../model/data.js')
var User = require('../model/user.js')
var bcrypt = require('bcrypt')


/* GET home page. */

router.get('/', function(req, res, next) {
  let tranghientai=req.query.page||1;
  let baivietmoitrang=3;
  let tongsobaiviet;
  MyPost.find()
  .countDocuments()
  .then(count=>{
    tongsobaiviet=count;
    const trangcuoicung=Math.ceil(tongsobaiviet/baivietmoitrang);
    MyPost.find()
    .skip((tranghientai-1)*baivietmoitrang)
    .limit(baivietmoitrang)
    .then(tatcabaiviet=>{
      res.render("index.ejs",{tatcabaiviet,tranghientai,tongsobaiviet,trangcuoicung});
    })
  })
   
  
});

router.get('/post', function(req, res, next) {
  res.render('post.ejs', { title: 'Express' });
});


router.get('/taomoi',function(req, res, next){
if(req.session.userId){
  return res.render('create.ejs');
}
  res.redirect('/dangnhap');
 
});
function kiemtrahople(req,res,next){
  if(!req.body.username||!req.body.title||!req.body.subtitle||!req.body.content||!req.files){
    return res.redirect('/taomoi')
  }
  next();
}
router.use('/them',kiemtrahople)
router.post('/them',function(req, res, next){
  var {image}=req.files;
  var mypath='public/posts/'+image.name
  image.mv(mypath,(error)=>{
    var mp =new MyPost({
      username:req.body.username,
      title:req.body.title,
      subtitle:req.body.subtitle,
      content:req.body.content,
      image:image.name
    })
    mp.save(err=>res.redirect('/'))
  });
  
});
router.get('/baiviet/:id',function(req, res,next){
  MyPost.findById({_id:req.params.id},
    (error,dulieu)=>res.render('post.ejs',{dulieu})
    )
});


router.get('/dangky', function(req, res, next) {
  res.render('dangky.ejs', { title: 'Express' });
});
 router.post('/dangky', function (req, res, next) {
 var nguoidung = new User(req.body)
 nguoidung.save(err =>{
   if(err)
     return res.redirect('/dangky')
   res.redirect('/')
   })
});

router.get('/dangnhap', function(req, res, next) {
  res.render('dangnhap.ejs');
});

router.post('/dangnhap', function (req, res, next) {
  var { email, password } = req.body
  User.findOne({ email }, function (err, nguoidung) {
   if (nguoidung) {
    bcrypt.compare(password, nguoidung.password, (err, same) => {
    if (same){
      req.session.userId=nguoidung._id
      res.redirect('/')
    
    }
    else
       res.redirect('/dangnhap')
     })
   }
   else
    res.redirect('/dangnhap')
  })
 });
 router.get('*',function (req, res, next) {
   res.locals.userId =req.session.userId
   next();
 });
 router.get('/dangxuat',function (req, res, next){
   req.session.userId =undefined
   res.redirect('/')
 });

 router.get('/xoa', function(req, res, next) {
  res.render('xoa.ejs', { title: 'Express' });
});
router.post('/xoa', function(req,res,next){
  MyPost.deleteOne(
    {title: req.body.title},
    err=> res.redirect('/')
  )
});

 router.get('/xoa/:maso',function(req, res, next) {
  MyPost.deleteOne(
    {_id: req.params.maso},
    err=> res.redirect('/')
  )
});

router.get('/sua', function(req, res, next) {
  var data= {}
  res.render('sua.ejs', {data});
});

router.post('/sua', function(req,res,next){
  MyPost.findOne(
    { _id: req.body.maso },
    (err, data) =>{
      if (!req.files || Object.keys(req.files).length ===0){
        data.title = req.body.title
        data.subtitle  = req.body.subtitle
        data.content = req.body.content
        data.save(err=> res.redirect('/'));
      }
      else {
        var hinh       = req.files.image;
        var uploadPath = 'public/posts/' + hinh.name;
        hinh.mv(uploadPath, function(err){
        if(err)
         return res.status(500).send(err);
          data.username  = req.body.username
          data.title   = req.body.title
          data.subtitle = req.body.subtitle
          data.image = hinh.name
          data.save(err=> res.redirect('/'));
      })
      }
      
    }
  )
});

router.get('/sua/:maso',function(req, res, next){
  MyPost.findOne(
    { _id: req.params.maso },
    (err, data) =>res.render('sua.ejs',{data})
  )
});

router.post('/tim',function(req, res, next) {

  MyPost.find({ username: { '$regex': req.body.username, $options: 'i'}})
        .then(tatcabaiviet => res.render('tim.ejs',{tatcabaiviet}))
        .catch(err => res.send('err'))
});
module.exports = router;
