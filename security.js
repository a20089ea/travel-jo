const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// وظيفة لتشفير كلمة المرور
const hashPassword = async (password) => {
  const saltRounds = 10; // عدد الجولات لتوليد salt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// وظيفة لمقارنة كلمة المرور المدخلة مع كلمة المرور المشفرة
const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// وظيفة لتوليد JWT بعد المصادقة الناجحة
const generateToken = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET, // ضع هنا مفتاح سري خاص بك
    { expiresIn: '1h' } // صلاحية التوكين لمدة ساعة
  );
  return token;
};

// التحقق من صحة التوكين المستخدم في الجلسات
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // استلام التوكين من هيدر الطلب
  if (!token) {
    return res.status(403).send('Access Denied');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid Token');
    }
    req.user = user;
    next();
  });
};

// حماية ضد الهجمات
const protectSensitiveData = (req, res, next) => {
  // مثال: التحقق من وجود بعض الحقول الأساسية في الطلب
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Missing required fields');
  }
  next();
};

module.exports = { hashPassword, comparePasswords, generateToken, authenticateToken, protectSensitiveData };
