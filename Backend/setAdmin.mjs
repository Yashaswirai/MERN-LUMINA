import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const email = 'admin@admin.com';
const password = 'admin';

const existingAdmin = await User.findOne({ email });

if (existingAdmin) {
  console.log('Admin already exists');
  process.exit();
}

await User.create({
  name: 'Admin',
  email,
  password,      // plain password — will be hashed in model
  isAdmin: true
});

console.log('✅ Admin created successfully');
process.exit();
