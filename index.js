const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require('./models/chat');
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().then(() => {
    console.log("Connection Succcessful");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
};

const port = 8080;


function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
};

app.get("/", (req, res) => {
    res.send("root is working")
});

app.get("/chats", asyncWrap(async (req, res, next) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
}));

// new route

app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
    // throw new ExpressError(500, "Page not found");
});


// post new message

app.post("/Chats", asyncWrap(async (req, res, next) => {
    let { from, msg, to } = req.body
    let newChat = new Chat({
        from: from,
        msg: msg,
        to, to,
        created_at: new Date()
    });
    await newChat.save();
    res.redirect("/chats")
}));



// new show Route

app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
        next(new ExpressError(500, "Chat Not Found"));
    }
    res.render("edit.ejs", { chat });
}));


// update Route

app.get("/chats/:id/edit", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat })
}));


app.put("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
    res.redirect("/chats");
}));


// detele Route


app.delete("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id).then(() => {
        console.log("Chat Deleted")
    }).catch((err) => {
        console.log(err);
    });
    res.redirect("/chats")
}));


const handleValidationErr = (err) =>{
    console.log("This was a Validation error, Please follow rules");
    console.dir(err.message);
    return err;
};


app.use((err, req, res, next) =>{
    console.log(err.name);
    if (err.name === "ValidationError"){
        err = handleValidationErr(err);
    }
    next(err);
})

// error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occured" } = err;
    res.status(status).send(message);
})


app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

