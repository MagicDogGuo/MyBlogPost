import express from "express";
import bodyParser from "body-parser";

const app = express();
// const port = 3000;
const port = process.env.PORT || 8080;

let posts = [
    {
      id: 1,
      title: "The Rise of Decentralized Finance",
      contentTexts:
        "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
      names: "Alex Thompson",
      date: "2023-08-01T10:00:00Z",
    },
    {
      id: 2,
      title: "The Impact of Artificial Intelligence on Modern Businesses",
      contentTexts:
        "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
      names: "Mia Williams",
      date: "2023-08-05T14:30:00Z",
    },
    {
      id: 3,
      title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
      contentTexts:
        "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
      names: "Samuel Green",
      date: "2023-08-10T09:15:00Z",
    },
  ];


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs",{posts: posts})

});

app.post("/submit", (req,res)=>{
    // Add
    console.log("__"+req.body.text);
    if(req.body.title!="" && req.body.name!=""
        && req.body.text != undefined && req.body.id == undefined){
        posts.push({
            id:posts.length + 1,
            title:req.body.title,
            names:req.body.name,
            contentTexts:req.body.text,
            date: new Date().toISOString()
        });
    }


    // Update
    if(req.body.id!=undefined){
        let id = parseInt(req.body.id);
        let foundIndex = posts.findIndex((post)=>{return post.id === id;});
        posts[foundIndex] = {
            id:foundIndex+1,
            title:req.body["title"],
            names:req.body["name"],
            contentTexts:req.body["text"],
            date: new Date().toISOString()
        }
        console.log(foundIndex+"==");

    }
    res.redirect("/");
})

app.post("/comment", (req,res)=>{
    res.render("comment.ejs");
})

app.post("/delete", (req, res) => {
    const id = parseInt(req.body.id); 
    let foundIndex = posts.findIndex((psot)=>{return psot.id ===id;});
    if (foundIndex >= 0 && foundIndex < posts.length) {
        posts.splice(foundIndex, 1);
    }else{

    }
    res.redirect('/');
});

app.post("/edit", (req, res) => {
    const id = parseInt(req.body.id); 

    let foundpost = posts.find((post)=>{return post.id === id});
    console.log(id+"  "+foundpost);
    res.render("comment.ejs",{editpost:foundpost});
});


app.listen(port,()=>{
    console.log(`listening ${port}`);
});