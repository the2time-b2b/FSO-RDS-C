require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");


const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

class Note extends Model { }
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: "note"
});
Note.sync();


app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.findAll();

    console.log(JSON.stringify(notes, null, 2));

    res.json(notes);
  }
  catch (error) {
    return res.status(400).send({ error });
  }
})


app.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (note) {
      console.log(note.toJSON());
      res.json(note);
    }
    else {
      res.status(404).end();
    }
  }
  catch (error) {
    return res.status(400).send({ error });
  }
});


app.put("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (note) {
      note.important = req.body.important;
      await note.save();
      res.json(note);
    }
    else {
      res.status(404).end();
    }
  }
  catch (error) {
    return res.status(400).send({ error });
  }
});


app.post("/api/notes", async (req, res) => {
  try {
    const note = Note.create(req.body);
    return res.json(note);
  }
  catch (error) {
    return res.status(400).send({ error });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
