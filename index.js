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

    request("http://makeup-api.herokuapp.com/api/v1/products.json?product_type=" + req.query.search,
    function(error,response,body) {
        if(JSON.parse(body).number > 0){
            const q = req.query.search;

            let imagelinks = [];
            let productlinks = [];
            let productnames = [];
            let prices = [];
            for (var i = 0; i < 10; i++)
            { 
                imagelinks.push(JSON.parse(body).results[i].image_link);
                productlinks.push(JSON.parse(body).results[i].product_link);
                productnames.push(JSON.parse(body).results[i].name);
                prices.push(JSON.parse(body).results[i].price);

            }

           
            res.render('cosmeticlist',{
                q:q,
                name1:productnames[0], name2:productnames[1], name3:productnames[2], name4:productnames[3], name5:productnames[4], name6:productnames[5], name7:productnames[6], name8:productnames[7], name9:productnames[8], name10:productnames[9],
                image1:imagelinks[0], image2:imagelinks[1], image3:imagelinks[2], image4:imagelinks[3], image5:imagelinks[4], image6:imagelinks[5], image7:imagelinks[6], image8:imagelinks[7], image9:imagelinks[8], image10:imagelinks[9], 
                prod1:productlinks[0], prod2:productlinks[1], prod3:productlinks[2], prod4:productlinks[3], prod5:productlinks[4], prod6:productlinks[5], prod7:productlinks[6], prod8:productlinks[7], prod9:productlinks[8], prod10:productlinks[9], 
                price1:prices[0], price2:prices[1], price3:prices[2], price4:prices[3], price5:prices[4], price6:prices[5], price7:prices[6], price8:prices[7], price9:prices[8], price10:prices[9]
            })
        }
        else{
            res.send("error fetching results!");
        }
    });
    

});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})