const mongoose = require('mongoose');
require('dotenv').config();

const initDB = async () => {
  try {
    // Подключение к MongoDB с правильными параметрами аутентификации
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('Connected to MongoDB successfully');
    
    // Создаем индексы для оптимизации
    const db = mongoose.connection.db;
    
    // Индексы для продуктов
    await db.collection('products').createIndex({ name: 1 });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    await db.collection('products').createIndex({ "stock.quantity": 1 });
    
    // Индексы для заказов
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ "items.productId": 1 });
    
    // Индексы для пользователей
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });
    
    // Индексы для корзин
    await db.collection('carts').createIndex({ userId: 1 }, { unique: true });
    await db.collection('carts').createIndex({ "items.productId": 1 });
    
    console.log('Database indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDB(); 