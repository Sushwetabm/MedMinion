const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongooseConnect = require("./connect");
const { errorMiddleWare } = require("./error");
const PatientRouter = require("./routes/patient");


const app = express();
dotenv.config({ path: "./config.env" });
const path = require("path");



//connecting to frontend
app.use(
  cors({
    origin: [process.env.frontend_URL],
    methods: "POST,GET",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/patient", PatientRouter);

mongooseConnect();

app.use(errorMiddleWare);

app.listen(process.env.PORT, () => {
  console.log("server started at port ", process.env.PORT);
});
