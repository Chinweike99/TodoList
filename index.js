const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "TodoList",
  password: "Innocent321@",
  port: 5432
});
db.connect();

const tasks = [
    { id: 1, task: "Study"},
    { id: 2, task: "Work"}
];

const familyMembers = [
    { id: 1, name: "Chinweike"}
]

let currentMember = 1;

app.get('/', (req, res) =>{
    res.render('index.ejs',{
        listName: "Today",
        listTask: tasks
    })
});

app.post('/family', (req, res)=>{
    if(req.body.add === "Add Family member"){
        res.render('new.ejs');
    }else{
        res.redirect('/');
    } 
})

app.post("/addTask", (req, res) =>{
    const item = req.body.taskName;
    tasks.push({ task: item });
    res.redirect('/');
});

app.post('/new', async (req, res)=>{
    const name = req.body.name;
    const addMember = await db.query(
        "INSERT INTO family (name) VALUES($1) RETURNING *;", [name]
    );
    const id = addMember.rows[0].id;
    currentMember = id;
    res.redirect('/');
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});