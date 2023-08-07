const express=require("express");
const app=express();
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const authRoute=require("./routes/auth");
const userRoute=require("./routes/users");
const postRoute=require("./routes/Posts");
const categoryRoute=require("./routes/categories");
const multer=require("multer");
const path=require("path");
const bodyParser=require("body-parser")


dotenv.config();

app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"/images")))

let cors = require("cors");

var corsOptions = {
    origin: ['http://localhost:3001','*'],
    methods : ['GET','POST','PUT','DELETE'],
    optionsSuccessStatus: 200 // For legacy browser support
  }
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  app.use(cors(corsOptions));
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

mongoose.connect(process.env.Mongo_URL,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Conected to mongo DB");
    }
});

const storage=multer.diskStorage({
   destination:(req,file,cb)=>{
       cb(null,"images")
   },
   filename:(req,file,cb)=>{
       cb(null,req.body.name)
   },
});

const upload=multer({storage:storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    res.status(200).json("image has been uploaded")
});



app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/categories",categoryRoute);

app.listen("3000",()=>{
    console.log("Server sucessfully ported on port 3000");
});