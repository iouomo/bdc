const express = require("express");
const router = express.Router();
const Planets = require("../models/planets");

const check = (req, res, next) => {
  if (req.query.hasOwnProperty("ms")) {
    console.log("req.query.ms", req.query.ms);
    let ms = +req.query.ms;
    if (isNaN(ms)) {
      res.status(500).json({ error: "ms is NaN!" });
      return;
    }
  }
  if (req.query.hasOwnProperty("ratio")) {
    console.log("req.query.ratio", req.query.ratio);
    let ratio = +req.query.ratio;
    if (isNaN(ratio)) {
      res.status(500).json({ error: "ratio is NaN!" });
      return;
    }
  }
  next();
};

router.get("/", check, async (req, res) => {
  try {
    res.status(200).json(await Planets.coordinates(req.query));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/aspects", check, async (req, res) => {
  try {
    res.status(200).json(await Planets.aspects(req.query));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
