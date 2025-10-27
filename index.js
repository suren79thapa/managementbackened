import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes); //  Prefix all routes with /api

app.get("/", (req, res) => {
  res.send({ success: true, message: "API is running..." });
});

mongoose
  .connect(
    "mongodb+srv://thapasurendra447:KLus2sgihJBUCkSi@cluster0.pwck3ty.mongodb.net/studentDB"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(" Database connected and server is running on port", port);
    });
  })
  .catch((err) => {
    console.log(" MongoDB connection error:", err);
  });
