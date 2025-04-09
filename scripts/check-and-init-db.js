const mongoose = require('mongoose');
require('dotenv').config();

const checkAndInitDB = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    const db = mongoose.connection.db;
    
    // Проверяем существование индексов
    const collections = ['products', 'orders', 'users', 'carts'];
    let needsInit = false;

    for (const collection of collections) {
      const indexes = await db.collection(collection).indexes();
      if (indexes.length <= 1) { // Если есть только индекс по _id
        needsInit = true;
        break;
      }
    }

    if (needsInit) {
      console.log('Database needs initialization...');
      require('./init-db.js');
    } else {
      console.log('Database is already initialized');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
};

// Запускаем проверку при старте приложения
checkAndInitDB(); 