const express = require("express");
const mysql = require("mysql2");
// const cors = require("cors");

const app = express();
// app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "us-cdbr-east-04.cleardb.com",
  user: "b838103563dc51",
  password: "b7565bef",
  database: "heroku_c0ee8d059847f3c",
});


// app.all("/", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

app.get("/", (req,res)=>{
    connection.query(
        'SELECT * FROM `items`',
        function (err, results, fields) {
          res.send(results);
          console.log(results); // results contains rows returned by server
          console.log(fields); // fields contains extra meta data about results, if available
        }
      );
});



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Your server is running on PORT ${PORT}`);
});
