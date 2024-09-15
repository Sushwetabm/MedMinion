const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongooseConnect = require("./connect");
const { errorMiddleWare } = require("./error");
const PatientRouter = require("./routes/patient");
const CheckRouter = require("./routes/check");
const DoctorRouter = require("./routes/doctor");
const AppointmentRouter = require('./routes/appointment');
const { connectDB } = require('./db');


const cookieParser = require("cookie-parser");
const { checkAuthentication } = require("./middlewares/user-auth");



const app = express();
dotenv.config({ path: "./config.env" });
const path = require("path");


connectDB().then(() => {

//connecting to frontend
app.use(
  cors({
    origin: [process.env.frontend_URL],
    methods: "POST,GET",
    credentials: true,
  })
);

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/patient", PatientRouter);
app.use("/doctor", DoctorRouter);
app.use('/doctor', AppointmentRouter); 
app.use("/checkuser", CheckRouter);


app.use(checkAuthentication);

app.get("/logout", (req, res) => {
  if (req.cookies.pid != undefined) res.clearCookie("pid");
  else res.clearCookie("aid");
  return res.json({ msg: "Logout Successful" });
});


mongooseConnect();

app.use(errorMiddleWare);

app.listen(process.env.PORT, () => {
  console.log("server started at port ", process.env.PORT);
});

});

