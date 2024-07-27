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
        // const familyMembers = await db.query("SELECT * FROM family");
        // let tasks = [];
        // if (req.query.memberId) {
        //     const taskResult = await db.query("SELECT * FROM tasks WHERE member_id = $1", [req.query.memberId]);
        //     tasks = taskResult.rows;
        // }

        res.render("index.ejs", {
            listName: "TODAY",
            // tasks: tasks,
            listTask: tasks,
            familyMembers: familyMembers,
            currentMemberId: req.query.memberId || null
        });
    } catch(err){
        console.error(err);
        res.status(500).send("Error" + err)
    }
});

app.post("/addTask", async (req, res) =>{
    // const task = req.body.taskName;
    // try{
    //     await db.query("INSERT INTO tasks (task) VALUES ($1)", [task]);
    //     res.redirect("/")
    // }catch(err){
    //     console.log(err)
    // }

    const { memberId, taskName } = req.body;
    try{
        await db.query("INSERT INTO tasks (task, member_Id) VALUES ($1, $2)", [taskName, memberId]);
        res.redirect('/?memberId=' + memberId);
    }catch(err){
        console.error(err);
        res.status(500).send("Server Error 2 has occurred, fix it");
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
        await db.query(
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


app.post("/edit", async (req, res) => {
    // const task = req.body.updateText;
    // const id = req.body.updatedId;
    const { updatedId, updateText, memberId } = req.body;

    try {
        await db.query("UPDATE tasks SET task = $1 WHERE id = $2", [updateText, updatedId]);
        res.redirect("/?memberId=" + memberId);
    }catch(error){
        console.error("Error Ocurred", error);
        res.status(500).send("Server Error1");
    }
});

app.post("/delete", async(req, res) => {
    // const id = req.body.deleteItemId;
    const { deleteItemId, memberId } = req.body;
    try {
        await db.query("DELETE FROM tasks WHERE id = $1", [deleteItemId]);
        res.redirect('/?memberId=' + memberId);
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error Occured");
    }
});

app.listen(port, ()=>{
    console.log(`Listening on port http://localhost:${port}`)
});