const express = require('express');
require('./config/db');   // ✅ This is JS code, not a terminal command
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
const connection = require('./config/db.js');
const app = express();
app.set('view engine', 'ejs');


dotenv.config();


app.use(express.static(__dirname + ("/public")));
app.use(express.static(__dirname + ("/view")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.redirect("/create.html");

});

app.get("/data", (req, res) => {
  connection.query("SELECT * FROM youtube_table", (error, rows) => {
    if (error) {
      console.log(error);
    } else {
      console.log(rows); // 👈 add this
      res.render("read.ejs", { rows });
    }
  });
});
 
// delete data//
app.get("/delete", (req, res) => {
  const deleteQuery = "DELETE FROM youtube_table WHERE id = ?";
  connection.query(deleteQuery,[req.query.id] ,(error, rows) => {
    if (error) {
      console.log(error);
    } else {
   
      res.redirect("/data");
    }
  });
});


// UPDATE DATA //

app.get("/update", (req, res) => {
 
  connection.query("select * FROM youtube_table WHERE id = ?",[req.query.id] ,(error, Eachrows) => {
    if (error) {
      console.log(error);
    } else {
      result=JSON.parse(JSON.stringify(Eachrows[0]));
      console.log(result);
      res.render("edit.ejs", { result });
    }
  });
});

app.post("/final_update", (req, res) => {
  const id = req.body.hidden_id;
  const name = req.body.name;
  const email = req.body.Email;
  const updateQuery = "update youtube_table SET name = ?, email = ? WHERE id = ?";


  try {
    connection.query(updateQuery, [name, email,id], (error, rows) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/data");
      }
    })

  } catch (error) {
    console.log(error);
  }

});




// create data//
app.post("/create", (req, res) => {
  const name = req.body.name;
  const email = req.body.Email;

  try {
    connection.query('INSERT INTO youtube_table (name, email) VALUES (?, ?)', [name, email], (error, rows) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/data");
      }
    })

  } catch (error) {
    console.log(error);
  }

});

app.listen(process.env.PORT || 4000, (error) => {
  if (error) throw error;

  console.log(`Server is running on port ${process.env.PORT}`);
});
