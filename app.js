const express = require('express');
const { hashPassword, comparePasswords, generateToken, authenticateToken, protectSensitiveData } = require('./auth');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(express.json()); // لقراءة البيانات من الطلبات

// قاعدة بيانات وهمية لتخزين المستخدمين
let users = [];

// تسجيل المستخدم
app.post('/register', protectSensitiveData, async (req, res) => {
  const { username, password } = req.body;

  // تحقق من أن المستخدم غير موجود بالفعل
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).send('Username already taken');
  }

  // تشفير كلمة المرور وتخزينها
  const hashedPassword = await hashPassword(password);

  // تخزين المستخدم الجديد
  const newUser = { id: Date.now(), username, password: hashedPassword };
  users.push(newUser);

  res.status(201).send('User created successfully');
});

// تسجيل الدخول
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // البحث عن المستخدم
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).send('Invalid username or password');
  }

  // التحقق من كلمة المرور
  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid username or password');
  }

  // توليد JWT وتوثيقه
  const token = generateToken(user);

  res.json({ message: 'Logged in successfully', token });
});

// مسار محمي بالـ JWT
app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route. You have access!');
});

// بدء الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
