const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }

  console.log("Connected to MySQL");
});

/*
 Home Page
*/
app.get("/", (req, res) => {

  const search = req.query.search;

  let sql = "SELECT * FROM employees";
  let params = [];

  if (search) {
    sql = "SELECT * FROM employees WHERE name LIKE ?";
    params = [`%${search}%`];
  }

  db.query(sql, params, (err, results) => {

    if (err) {
      return res.status(500).send(err.message);
    }

      let html = `
      <html>
      <head>
        <title>Employee Portal</title>
        <style>
          body {
            font-family: Arial;
            margin: 40px;
            background: #f4f4f4;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            background: white;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 10px;
          }

          th {
            background: #333;
            color: white;
          }
        </style>
      </head>

      <body>
        <h1>DevOps Employee Portal-Webhook Test</h1>
        <h2>Total Employees: ${results.length}</h2>
        <form method="POST" action="/add-employee">

  <input
    type="text"
    name="name"
    placeholder="Employee Name"
    required>

  <input
    type="text"
    name="department"
    placeholder="Department"
    required>

  <input
    type="email"
    name="email"
    placeholder="Email"
    required>

  <button type="submit">
    Add Employee
  </button>

</form>

<br>
<form method="GET" action="/">

  <input
    type="text"
    name="search"
    placeholder="Search Employee">

  <button type="submit">
    Search
  </button>

</form>

<br>

        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Email</th>
          </tr>
      `;

      results.forEach(emp => {
        html += `
          <tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.email}</td>
          </tr>
        `;
      });

      html += `
        </table>
      </body>
      </html>
      `;

      res.send(html);
    }
  );
});

/*
 API Endpoint
*/
app.get("/employees", (req, res) => {

  db.query(
    "SELECT * FROM employees",
    (err, results) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(results);
    }
  );
});
/*
 Add Employee
*/
app.post("/add-employee", (req, res) => {

  const { name, department, email } = req.body;

  db.query(
    "INSERT INTO employees (name, department, email) VALUES (?, ?, ?)",
    [name, department, email],
    (err) => {

      if (err) {
        return res.status(500).send(err.message);
      }

      res.redirect("/");
    }
  );

});
/*
 Health Check
*/
app.get("/health", (req, res) => {

  res.json({
    status: "UP"
  });

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
