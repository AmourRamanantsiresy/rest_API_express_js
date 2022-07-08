const express = require("express");
const fs = require("fs");
const app = express();
const users = require("./users.json");

//Middleware
app.use(express.json())

//get all users
app.get("/users", (req, res) => {
    res.status(200).json(users);
})

//get the user with his id
app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id)
    res.status(200).json(users.find(e => e.id === id));
})

//add new user
app.post("/users", (req, res) => {
    const result = req.body;
    if (verify_data_structure(result)) {
        const temp = users.slice();
        result["id"] = temp[temp.length - 1].id + 1;
        temp.push(result);
        modify_users_file(temp, () => {
            res.status.apply(201).json(result);
        })
    } else {
        res.status(403).send("Please verify your request body");
    }
})

//delete user this hi id
app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const result = users.filter(e => e.id != id);
    modify_users_file(result, () => {
        res.status(200).send("id : " + id + "successful")
    })
})


//update users
app.put("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const result = req.body;
    if (verify_data_structure(result)) {
        const temp = users.slice();
        result["id"] = id;
        temp[id - 1] = result;
        modify_users_file(temp, () => {
            res.status.apply(200).json(result);
        })
    } else {
        res.status(403).send("Please verify your request body");
    }
})


app.listen(9000, () => {
    console.log("Server is started")
})

function verify_data_structure(data) {
    const keys = ['first_name', 'last_name', 'company'];
    if (Object.keys(keys).length != 3) {
        return false;
    } for (let i of keys) {
        if (i != 'id' && data[i].length === 0) {
            return false
        }
    } return true;
}

function modify_users_file(data, callback) {
    fs.writeFile("users.json", JSON.stringify(data), () => {
        callback;
    });
}