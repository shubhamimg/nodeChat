const mongoose = require("mongoose");
const Chat = require('./models/chat');



main().then(() => {
    console.log("Connection Succcessful");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
}

let allChats =  [
    {
        from: "rahul",
        to: "deepak",
        msg: "Did you complete the assignment?",
        created_at: new Date()
    },
    {
        from: "shreya",
        to: "kiran",
        msg: "Happy birthday! Have a great day!",
        created_at: new Date()
    },
    {
        from: "amit",
        to: "nisha",
        msg: "Can we meet tomorrow evening?",
        created_at: new Date()
    },
    {
        from: "anita",
        to: "vikram",
        msg: "Thanks for the notes, really helpful!",
        created_at: new Date()
    },
    {
        from: "sunil",
        to: "pankaj",
        msg: "Don't forget about the meeting at 3 PM.",
        created_at: new Date()
    }
]



Chat.insertMany(allChats);

