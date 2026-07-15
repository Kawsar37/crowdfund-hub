const dns = require('node:dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@crowdpulse.com';

    const existingAdmin = await User.findOne({ user_email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const admin = await User.create({
      display_name: 'Platform Admin',
      user_email: adminEmail,
      photo_url: '',
      password: hashedPassword,
      role: 'admin',
      credits: 0
    });

    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
