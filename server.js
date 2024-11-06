//Framework Configuration
const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const hbs = require("hbs");
const path = require("path");
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const doctorRoutes = require("./routes/doctorRoutes");
const multer=require('multer');
const uploads=multer({dest:'uploads/'});
const Profile = require("./model/Profile");
const dotenv = require("dotenv");
dotenv.config();

connectDb();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(errorHandler);

app.use('/api/register', require("./routes/userRoutes"));
app.use('/api/doctors', require("./routes/doctorRoutes"));

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
            { username: "Parth", date: "23-10-2024", subject: "Maths" },
            { username: "Aarav", date: "23-10-2024", subject: "Science" },
            { username: "Ishita", date: "23-10-2024", subject: "History" }
        ]
    })
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const fileExtension = path.extname(file.originalname); // Extract file extension
      cb(null, file.fieldname + '-' + uniqueSuffix+fileExtension);
    }
  })
  
//   const upload = multer({ storage: storage })
 const upload = multer({storage : storage});

// app.post('/profile', upload.single('avatar'), function (req, res, next) {
//    console.log(req.body);
//    console.log(req.file);
//    return res.redirect("/home");
//   })

let  imageUrls = [];
app.post("/profile", upload.single("avatar"), function(req, res, next) {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    console.log(req.body);
    console.log(req.file);

    const fileName = req.file.filename;
    const imageUrl = `/uploads/${fileName}`;
    imageUrls.push(imageUrl);
    return res.render("allimages", {
        imageUrls: imageUrls
    });
});

app.get("/allimages", (req, res) => {
    const imageUrls = []; 
    res.render("images", { imageUrls: imageUrls }); 
});

app.get("/allusers",(req,res)=>{
    res.render("users",{
        users: [
            { username: "Parth", date: "23-10-2024", subject: "Maths" },
            { username: "Aarav", date: "23-10-2024", subject: "Science" },
            { username: "Ishita", date: "23-10-2024", subject: "History" }
        ]
    })
})

hbs.registerPartials(path.join(__dirname, '/views/partials'));

// APP CONFIG START
app.listen(port, () =>{
    console.log(`Server running in port http://localhost:${port}`);
});