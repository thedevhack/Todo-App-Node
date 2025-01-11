const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { type } = require('os');
const path = require("path")
// const cors = require('cors');

const app = express();
// app.use(cors())

app.use(bodyParser.json());

function removeAtIndex(arr, idtobeDeleted){
  console.log(arr, idtobeDeleted)
  var indexx = -1;
  for (let i=0;arr.length;i++){
    if (arr[i].id === idtobeDeleted){
      indexx = i;
      break
    }
  }
  if (indexx === -1) return indexx;
  var newModifiedArray = [];

  for (let j=0;j<arr.length;j++){
    if (j != indexx) newModifiedArray.push(arr[j]);
  }
  return newModifiedArray;
}

function getAllTodos(req, res){
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err){

      console.log(err)
      res.status(500).send()
    }else{
      res.status(200).json(JSON.parse(data))
    }
  });
    

}

function getTodo(req, res){
  var idtobeExtracted = parseInt(req.params.id);

  fs.readFile("todos.json","utf8", (err, data) => {
    if (err) throw err;

    var todos = JSON.parse(data);
    let todo = todos.find((todo) => todo.id === idtobeExtracted)

    if (!todo) {
      res.status(404).send("Not found")
    }
    res.status(200).json( todo )
    })
  }

function addTodo(req, res){
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err){
      var todos = []
    }else{
      var todos = (data.length > 1) ? JSON.parse(data) : [];
    }
    fs.readFile("counter.txt", "utf8", (err, data) => {
      if (err){
        var totalTodos = 0
      }else{
        var totalTodos = parseInt(data);
      }
      if ((req.body.title) || (req.body.description)){
        totalTodos++;
        todos.push({
          id:totalTodos,
          title: req.body.title,
          description: req.body.description,
          completed: (req.body.completed) ? req.body.completed : false
        })
        // console.log("pop")
        fs.writeFile("todos.json", JSON.stringify(todos), () => {})
        fs.writeFile("counter.txt", JSON.stringify(totalTodos), () => {})
        res.status(201).send({id:totalTodos})
      }
    });
  });
  }


function editTodo(req, res){


    let idtobeExtracted = parseInt(req.params.id);
    fs.readFile("todos.json", "utf8", (err,data) => {
      if (err) throw err;

      var todos = JSON.parse(data);

      let todo = todos.find((todo) => todo.id === idtobeExtracted);

      if (!todo) {
        res.status(404).send("Not found");
      }

      todo.title = req.body.title;
      todo.description = req.body.description;

      fs.writeFile("todos.json", JSON.stringify(todos), () => {})
      res.status(200).send({ id: todo.id });

    })
    
}

function deleteTodo(req, res){
  idtobeDeleted = parseInt(req.params.id);
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    var todos = JSON.parse(data);
    
    // todos.forEach((todo, index) => {
    //   if (todo.id === idtobeDeleted){
    //     todos.splice(index, 1);
    //     console.log(todos)
        
    //     // fs.writeFile("todos.json", JSON.stringify(todos), () => {})
    //     res.status(200).send({id:todo.id})
    //   }
    // })

    var modifiedArr = removeAtIndex(todos, idtobeDeleted)

    if (modifiedArr === -1) res.status(404).send("Not found");

    fs.writeFile("todos.json", JSON.stringify(modifiedArr), () => {})
    res.status(200).json({idtobeDeleted})
    
  }) 
}


app.get("/todos", getAllTodos)
app.get("/todos/:id", getTodo)
app.post("/todos", addTodo)
app.put("/todos/:id", editTodo)
app.delete("/todos/:id", deleteTodo)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"))
})

app.use((req, res, next) => {
  res.status(404).send("No such route")
})



app.listen(3000, () => {console.log("Server Started")});

module.exports = app;
