## 資料庫結構設計（MongoDB）

```js
// User
{
  _id,
  username,
  email,
  password,
  role: 'admin' | 'user',
  donateuser: 'yes' | 'no',
  favorites: [postId],    // 收藏的文章列表
  createdAt,
  updatedAt              // 更新時間
}

// Post
{
  _id,
  title,
  content,
  author: {
    type: ObjectId,
    ref: 'User'
  },
  imageUrl,             // 文章封面圖片
  tags: [String],
  likes: [{             // 按讚功能
    user: {
      type: ObjectId,
      ref: 'User'
    }
  }],
  commentCount: Number,  // 新增：評論數量統計
  createdAt,
  updatedAt
}

// Comment（獨立集合）
{
  _id,
  postId: {              // 與 Post 的關聯
    type: ObjectId,      // 存儲 Post 的 _id
    ref: 'Post'          // 指向 Post 集合
  },
  user: {                // 與 User 的關聯
    type: ObjectId,      // 存儲 User 的 _id
    ref: 'User'          // 指向 User 集合
  },
  content: String,
  isPublic: Boolean,    // 評論是否公開
  createdAt,
  updatedAt
}

// Subscriber（電子報訂閱）
{
  _id,
  email,
  subscribedAt,
  updatedAt,           // 更新時間
  status: 'active' | 'unsubscribed'  // 訂閱狀態
}
```