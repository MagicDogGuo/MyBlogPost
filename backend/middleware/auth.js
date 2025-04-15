const auth = (req, res, next) => {
  // 暫時使用一個固定的用戶ID
  req.user = {
    _id: 'default_user_id',
    name: 'Anonymous',
    isAdmin: false
  };
  next();
};

module.exports = auth; 