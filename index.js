import express from "express";
import bodyParser from "body-parser";

const app = express();
// const port = 3000;
const port = process.env.PORT || 8080;

const data = {
    title: ["The Rise of Decentralized Finance"],
    names: ["Alex Thompson"],
    contentTexts: ["Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading."],
    EditIndex:-1
};

// let posts = [
//     {
//       id: 1,
//       title: "The Rise of Decentralized Finance",
//       content:
//         "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
//       author: "Alex Thompson",
//       date: "2023-08-01T10:00:00Z",
//     },
//     {
//       id: 2,
//       title: "The Impact of Artificial Intelligence on Modern Businesses",
//       content:
//         "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
//       author: "Mia Williams",
//       date: "2023-08-05T14:30:00Z",
//     },
//     {
//       id: 3,
//       title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
//       content:
//         "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
//       author: "Samuel Green",
//       date: "2023-08-10T09:15:00Z",
//     },
//   ];


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"))

app.get("/",(req,res)=>{
    if(req.body["name"]!=undefined){
        data.title.push(req.body["title"]);
        data.names.push(req.body["name"]);
        data.contentTexts.push(req.body["text"]);
        
    }

    res.render("index.ejs",data);
    // res.send("hello their");
})
app.post("/submit", (req,res)=>{
    // Add
    if(req.body["name"]!="" && req.body["index"]==undefined){
        data.title.push(req.body["title"]);
        data.names.push(req.body["name"]);
        data.contentTexts.push(req.body["text"]);
    }

    // Update
    if(req.body["index"]!=undefined){
        let index = req.body["index"];
        data.title[index] = req.body["title"];
        data.names[index] = req.body["name"];
        data.contentTexts[index] = req.body["text"];
    }
    res.redirect("/");
})

app.post("/comment", (req,res)=>{
    res.render("comment.ejs");
})

app.post("/delete", (req, res) => {
    const index = req.body.index; // 从表单中获取索引
    if (index >= 0 && index < data.names.length) {
        // 从数组中删除元素
        data.names.splice(index, 1);
        data.contentTexts.splice(index, 1);
    }
    res.redirect('/'); // 重定向回主页或其他适当页面
});

app.post("/edit", (req, res) => {
    const index = req.body.index; 
    data.EditIndex = index;
    res.render("comment.ejs",data);
    data.EditIndex=-1;
});


app.listen(port,()=>{
    console.log(`listening ${port}`);
});