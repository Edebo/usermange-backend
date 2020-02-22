import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import helmet from "helmet";

import "dotenv/config";

//routes
import authRoute from "../routes/auth";
import userRoute from "../routes/user";

const app = express();

//security middleware:setting http headers
app.use(helmet());

//database connection
mongoose
  .connect(process.env.DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("connection not succesful");
  });

//set static folder
app.use(express.static(path.join(__dirname, "public")));
//making the uploads folder publicly available
app.use("/uploads", express.static("uploads"));
app.use(cors());
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
// // parse application/json
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// for parsing application/json
// app.use(express.json());

// // for parsing application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
//data sanitization against noSQL query injection
app.use(mongoSanitize());
//data sanitization against XSS
app.use(xssClean());
//prevent parameter pollution

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

app.use("/", (req, res) => {
  res.send("oops page not found");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server started successufully");
});
