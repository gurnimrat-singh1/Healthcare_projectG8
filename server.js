//Framework Configuration
const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const hbs = require("hbs");
const path = require("path");
hbs.registerPartials(__dirname + '/views/partials', function (err) { console.log(err)});

const dotenv = require("dotenv");
dotenv.config();

connectDb();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
//Routes for user registeration and authentication
// app.use("/api/register",require("./routes/userRoutes"));


app.use(errorHandler);

// ERROR handling middleware
app.use(errorHandler);

app.set('view engine', 'hbs');


//ROUTES BELOW
app.get('/',(req,res)=>{
    res.send("working");
});

app.get("/home",(req,res)=>{
    res.render("home",{
        users: [
            { username: "Gurnimrat Singh", date: "23-10-2024", subject: "Maths" },
            { username: "Raghav Nag", date: "23-10-2024", subject: "Science" },
            { username: "Guntas Singh", date: "23-10-2024", subject: "History" }
        ]
    })
})


app.get("/allusers",(req,res)=>{
    res.render("users",{
        users: [
            { username: "Gurnimrat Singh", date: "23-10-2024", subject: "Maths" },
            { username: "Raghav Nagi", date: "23-10-2024", subject: "Science" },
            { username: "Guntas Singh", date: "23-10-2024", subject: "History" }
        ]
    })
})



// APP CONFIG START
app.listen(port, () =>{
    console.log(`Server running in port http://localhost:${port}`);
});