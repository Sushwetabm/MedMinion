const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongooseConnect = require("./connect");
const { errorMiddleWare } = require("./error");
const PatientRouter = require("./routes/patient");
const CheckRouter = require("./routes/check");
const DoctorRouter = require("./routes/doctor");
const AppointmentRouter = require("./routes/appointment");
const PatientBookingRouter = require("./routes/patient_booking");
const { connectDB } = require("./db");

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
  app.use("/doctor", AppointmentRouter);
  app.use("/patient_booking", PatientBookingRouter);
  app.use("/checkuser", CheckRouter);
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));


  app.use(checkAuthentication);

  // app.get("/logout", (req, res) => {
  //   if (req.cookies.pid != undefined) res.clearCookie("pid");
  //   else res.clearCookie("aid");
  //   return res.json({ msg: "Logout Successful" });
  // });

  app.get("/logout", (req, res) => {
    if (req.cookies.pid) {
      res.clearCookie("pid");
    } else if (req.cookies.aid) {
      res.clearCookie("aid");
    } else {
      return res.status(400).json({ msg: "No session found" }); // Explicitly handle the case where no cookies are found
    }
  
    return res.status(200).json({ msg: "Logout Successful" });
  });
  

  mongooseConnect();

  app.use(errorMiddleWare);

  app.listen(process.env.PORT, () => {
    console.log("server started at port ", process.env.PORT);
  });
});
