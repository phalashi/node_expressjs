const express = require('express')
const app = express()
const request = require('request');
const port = 5500

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

app.set('view engine',"ejs")
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('base')
})

app.get('/cosmetic', (req, res) => {
    res.render('cosmetic')
})
app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/signin', (req, res) => {
    res.render('signin')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/signinsubmit', (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    db.collection('users')
        .where("email","==",email)
        .where("password","==",password)
        .get()
        .then((docs) => {
            if (docs.size > 0){
                res.render("home");
            }
            else{
                res.render("signup");
            }
        });
});

app.get('/signupsubmit', (req, res) => {
    const full_name = req.query.full_name;
    const email = req.query.email;
    const password = req.query.password;
    db.collection('users').add({
        name:full_name,
        email:email,
        password:password,
    }).then(()=>{
        res.render("signin")
    });
});


app.get('/query',function(req,res){

    request('https://api.spoonacular.com/recipes/complexSearch?query='+req.query.query+'&apiKey=1bc3c5a2309b4f3e8411af3de8988074',
    function(error,response,body){
        if(JSON.parse(body).number > 0){
            const q = req.query.query;
            const img0 = JSON.parse(body).results[0].image;
            const img1 = JSON.parse(body).results[1].image;
            const img2 = JSON.parse(body).results[2].image;
            const img3 = JSON.parse(body).results[3].image;
            const img4 = JSON.parse(body).results[4].image;
            const img5 = JSON.parse(body).results[5].image;
            const img6 = JSON.parse(body).results[6].image;
            const img7 = JSON.parse(body).results[7].image;
            const img8 = JSON.parse(body).results[8].image;
            const title0 = JSON.parse(body).results[0].title;
            const title1 = JSON.parse(body).results[1].title;
            const title2 = JSON.parse(body).results[2].title;
            const title3 = JSON.parse(body).results[3].title;
            const title4 = JSON.parse(body).results[4].title;
            const title5 = JSON.parse(body).results[5].title;
            const title6 = JSON.parse(body).results[6].title;
            const title7 = JSON.parse(body).results[7].title;
            const title8 = JSON.parse(body).results[8].title;
            res.render('foodrecipe',{q:q,img0:img0,img1:img1,img2:img2,img3:img3,img4:img4,img5:img5,img6:img6,img7:img7,img8:img8,title0:title0,title1:title1,title2:title2,title3:title3,title4:title4,title5:title5,title6:title6,title7:title7,title8:title8})
        }
        else{
            res.send("smtg went wrong");
        }
    });
    

});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})