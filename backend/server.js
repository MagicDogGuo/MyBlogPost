import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

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

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 獲取所有文章
app.get("/api/posts", (req, res) => {
    res.json(posts);
});

// 創建新文章
app.post("/api/posts", (req, res) => {
    const { title, name, text } = req.body;
    if (title && name && text) {
        const newPost = {
            id: posts.length + 1,
            title,
            names: name,
            contentTexts: text,
            date: new Date().toISOString()
        };
        posts.push(newPost);
        res.status(201).json(newPost);
    } else {
        res.status(400).json({ error: "Missing required fields" });
    }
});

// 更新文章
app.put("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, name, text } = req.body;
    const foundIndex = posts.findIndex(post => post.id === id);
    
    if (foundIndex >= 0) {
        posts[foundIndex] = {
            ...posts[foundIndex],
            title,
            names: name,
            contentTexts: text,
            date: new Date().toISOString()
        };
        res.json(posts[foundIndex]);
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

// 刪除文章
app.delete("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const foundIndex = posts.findIndex(post => post.id === id);
    
    if (foundIndex >= 0) {
        posts.splice(foundIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 