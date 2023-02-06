require("dotenv").config();
const express = require("express");
const {v4: uuidv4} = require("uuid");
require("colors");
const cors = require("cors");
const pool = require("./db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json())
// get all todos
app.get("/todos/:userEmail", async (req, res) => {
    try {
        const {userEmail} = req.params;
        const todos = await pool.query(
            `select * from todos where user_email = $1`,
            [userEmail]
        );
        res.json(todos.rows);
    } catch (err) {
        console.log(err);
        res.status(err.status).send({'detail': err.detail});
    }
});

//create a new todos
app.post('/todos', async (req, res) => {
    try {
        const {user_email, title, progress, date} = req.body;
        const id = uuidv4();
        const newToDo = await pool.query("INSERT INTO todos (id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5)", [
            id, user_email, title, progress, date
        ]);
        res.status(201).json(newToDo);
    } catch (err) {
        console.error(err);
        res.status(err.status).send({'detail': err.detail});
    }
});

//update a specific todo by id
app.put('/todos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {user_email, title, progress, date} = req.body;
        const updateToDo = await pool.query("UPDATE todos SET user_email=$1, title=$2, progress=$3, date=$4 WHERE id = $5;", [
            user_email, title, progress, date, id
        ]);
        res.status(203).json(updateToDo);
    } catch (err) {
        console.error(err);
        res.status(err.status).send({'detail': err.detail});
    }
});
//delete a specific todo by id
app.delete('/todos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deleteToDo = await pool.query("DELETE FROM todos WHERE id = $1;", [id]);
        res.status(200).json(deleteToDo);
    } catch (err) {
        console.error(err);
        res.status(err.status).send({'detail': err.detail});
    }
});
//login
app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!user.rows.length) {
            return res.status(404).json({"message": "User not found!"})
        }
        const success = await bcrypt.compare(password, user.rows[0].hashed_password)
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
        if (success) {
            return res.status(200).json({'email': user.rows[0].email, token})
        } else {
            res.status(400).json({detail: 'Login Failed'})
        }
    } catch (err) {
        console.error(err);
        res.status(err.status).send({'detail': err.detail});
    }
});
//sign-up
app.post('/sign-up', async (req, res) => {
    const {email, password} = req.body;
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        let user = await pool.query(`INSERT INTO users (email,hashed_password) VALUES ($1,$2)`, [email, hashedPassword])
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
        res.status(200).json({email, token})
    } catch (err) {
        console.error(err);
        if (err)
            res.status(err.status).send({'detail': err.detail});
    }
});

app.listen(PORT, () => {
    console.clear();
    console.log(`Server running on `.green + `http//${process.env.DB_HOST}:${process.env.PORT}`.blue);
});
