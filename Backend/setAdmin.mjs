import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js'; // Use .js extension since we are using ES modules

dotenv.config(); // Load environment variables from .env file

const adminEmail = 'test@admin.com'; // Set the admin email here
const adminPassword = 'admin'; // Set the admin password here
const adminName = 'Admin User'; // Set the admin name here

const adminUser = {
  name: adminName,
  email: adminEmail,
  password: adminPassword, // We'll hash it before saving
  isAdmin: true, // Mark this user as admin
};

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    // Hash the admin password before saving
    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(adminUser.password, salt);

    // Create the admin user
    const newAdmin = new User(adminUser);
    await newAdmin.save();

    console.log('Admin user created successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error creating admin:', err);
    mongoose.connection.close();
  }
};

createAdminUser();
