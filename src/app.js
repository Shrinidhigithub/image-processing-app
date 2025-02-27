require("dotenv").config();
const express = require("express");
const cors = require("cors");

const uploadRoute = require("./routes/upload");
const statusRoute = require("./routes/status");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/status", statusRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
