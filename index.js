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
    { id: 1, name: "Chinweike"},
    { id: 2, name: "Innocent"}
]

let currentMember = 1;

// app.get('/', (req, res) =>{
//     res.render('index.ejs',{
//         listName: "Today",
//         listTask: tasks,
//         familyMembers: familyMembers
//     })
// });

app.get('/', async (req, res)=>{
    try{
        const taskResult = await db.query("SELECT * FROM tasks;");
        const tasks = taskResult.rows;

        const familResult = await db.query("SELECT * FROM family;");
        const familyMembers = familResult.rows;

        res.render("index.ejs", {
            listName: "TODAY",
            // tasks: tasks,
            listTask: tasks,
            familyMembers: familyMembers
        });
    } catch(err){
        console.error(err);
        res.send("Error" + err)
    }
});

app.post("/addTask", async (req, res) =>{
    // const item = req.body.taskName;
    const { memberId, taskName } = req.body;
    try{
        await db.query("INSERT INTO tasks (task, member_Id) VALUES ($1, $2)", [taskName, memberId]);
        res.redirect('/');
    }catch(err){
        console.error(err);
        res.status(500).send("Error");
    }
});

app.post('/family', (req, res)=>{
    if(req.body.add === "Add Family member"){
        res.render('new.ejs');
    }else{
        res.redirect('/');
    } 
})

app.post('/new', async (req, res)=>{
    const name = req.body.name;
    try {
        const exists = await db.query(
            "SELECT * FROM family WHERE name = $1", [name]
        );
        if (exists.rows.length > 0){
            res.render('new.ejs', {error: "Family member exists"});
            return;
        }
        const addMember = await db.query(
            "INSERT INTO family (name) VALUES($1) RETURNING *;", [name]
        );
     
        // const id = addMember.rows[0].id;
        // currentMember = id;
        res.redirect('/');
    } catch(error){
        res.render('new.ejs', {error: "An error occured"});
        console.error("Error adding family member", error);
    }
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});