// seedAdmin.js - Jalankan sekali: node seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const existing = await User.findOne({ username: 'admin' });
  if (existing) { console.log('Admin sudah ada'); process.exit(); }
  
  await User.create({
    name: 'Admin Owner',
    username: 'admin',
    password: 'password123',
    role: 'owner',
  });
  
  console.log('✅ Admin berhasil dibuat! Username: admin, Password: password123');
  process.exit();
};

seed().catch(console.error);