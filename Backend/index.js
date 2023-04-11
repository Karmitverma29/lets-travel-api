const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://karmitverma:karmitverma@cluster0.vr6b5wb.mongodb.net/plan-my-trip?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

const travelSchema = new mongoose.Schema({
  name: String,
  email: String,
  destination: String,
  travellers: Number,
  budget: Number,
});

const Travel = mongoose.model("Travel", travelSchema);

app.post("/api/travel", async (req, res) => {
  const { name, email, destination, travellers, budget } = req.body;
  const travel = new Travel({ name, email, destination, travellers, budget });

  try {
    await travel.save();
    res.status(201).json(travel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/travel", async (req, res) => {
  try {
    const travel = await Travel.find();
    res.json(travel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/travel/:destination", async (req, res) => {
  try {
    const travel = await Travel.find({ destination: req.params.destination });
    res.json(travel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/travel/sort/:order", async (req, res) => {
  try {
    let order = req.params.order;
    let sortOrder = 1;
    if (order === "desc") {
      sortOrder = -1;
    }
    const travel = await Travel.find().sort({ budget: sortOrder });
    res.json(travel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server started on port ${port}`));
