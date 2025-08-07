const express = require('express');
const path = require('path'); 
const app = express();
const PORT = 3000;
const mysql = require('mysql');


app.use(express.urlencoded({extended:true})); // middleware to parse the login form data  THIS IS REQUIRED TO HANDLE THE POST REQUEST FORM DATA FROM THE LOGIN FORM 


app.get('/' , (req,res)=>{
    res.sendFile(path.join(__dirname , 'views' , 'index.html')); // this means that  whenever i get a / req then send the index .html file into the web  thats why i used sendfile  .pathjoin views and index.html 

});


const db = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:'Abhisingh24',
    database:'injection_project'
});

db.connect(err=>{
    if(err){
        console.log("DATABASE CONNECTION FAILED " , err);
    }else{
        console.log(" YAY CONNECTED TO MARIA DB ");
    }
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`LOGIN ATTEMPT FROM USERNAME : ${username} , PASSWORD : ${password}`);

    const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`; // THIS IS THE EXPOSED VULNERABILITY
    // I BYPASSED BECAUSE OF THIS LINE Username: ' OR 1=1 -- WHICH MEANS IT IS EXPECTING MY USERNAME TO BE '' EMPTY STRING WHICH IS FALSE BECAUSE NOTHING LIKE THAT EXIST IN DB AND THEN OR 1 =1  WHICH IS ALWAYS TRUE THEN I USED -- WHICH MEANS IGNORE EVERYTHING AFTER THIS SO EVEN THE PASSWORD GETS IGNORED SO THIS CONDITION BECOMES ALWAYS TRUE FOR THESE CASES 

    db.query(sql, (err, result) => {
        if (err) {
            console.log("SERVER ERROR ");
            return res.send(`<h2> OH NO ! SERVER ERROR </h2>`);
        }
        if (result.length > 0) {
            const user = result[0];
            
            if(user.role=='admin'){
            return res.sendFile(path.join(__dirname , 'views' , 'admin.html'));
            }else{
            return res.sendFile(path.join(__dirname , 'views' , 'userdata.html'));
            }
        } 
            return res.send(`<h1>LOGIN FAILED </h1>`);
    });
});
app.listen(PORT , ()=>{
    console.log(`server is running at port ${PORT}`);
});
