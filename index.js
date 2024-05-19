import express from "express";
import bodyParser from "body-parser";

const app = express();
// const port = 3000;
const port = process.env.PORT || 8080;

const data = {
    names: [],
    contentTexts: [],
    EditIndex:-1
};


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"))

app.get("/",(req,res)=>{
    if(req.body["name"]!=undefined){
        data.names.push(req.body["name"]);
        data.contentTexts.push(req.body["text"]);
        
    }

    res.render("index.ejs",data);
    // res.send("hello their");
})
app.post("/submit", (req,res)=>{
    // Add
    if(req.body["name"]!="" && req.body["index"]==undefined){
        data.names.push(req.body["name"]);
        data.contentTexts.push(req.body["text"]);
    }

    // Update
    if(req.body["index"]!=undefined){
        let index = req.body["index"];
        data.names[index] = req.body["name"];
        data.contentTexts[index] = req.body["text"];
    }
    res.render("index.ejs",data);
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