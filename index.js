const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path  = require("path");
const Chat = require('./models/chat');
const methodOverride = require("method-override");



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main().then(() =>{
    console.log("Connection Succcessful");
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
}

const port = 8080;


app.get("/", (req, res) =>{
    res.send("root is working")
});

app.get("/chats", async (req, res) =>{
    let chats = await Chat.find();
    res.render("index.ejs", {chats});
});

// new route

app.get("/chats/new", (req, res) =>{
    res.render("new.ejs")
})


// post new message

app.post("/Chats", (req, res) =>{
    let {from, msg, to} = req.body
    let newChat = new Chat ({
        from: from,
        msg: msg,
        to, to,
        created_at: new Date()
    });
    newChat.save().then((res) =>{
        console.log("POst Result", res);
    }).catch((err) =>{
        console.log(err);
    });
    res.redirect("/chats")
});

// update Route

app.get("/chats/:id/edit", async (req, res) =>{
    
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat})
});


app.put("/chats/:id", async (req, res) =>{
    let {id} = req.params;
    let {msg: newMsg} = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg}, {runValidators: true, new: true});
    res.redirect("/chats");
});


// detele Route


app.delete("/chats/:id", async (req, res) =>{
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id).then(() =>{console.log("Chat Deleted")
    }).catch((err) =>{console.log(err);
    });
    res.redirect("/chats")
});


app.listen(port, () =>{
    console.log(`Server is listening on ${port}`);
});

