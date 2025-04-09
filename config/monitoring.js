const mongoose = require('mongoose');

module.exports = {
  setupMonitoring: () => {
    // Базовые события подключения
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    // Мониторинг медленных запросов
    mongoose.set('debug', (collectionName, method, query, doc) => {
      const startTime = Date.now();
      return (err, result) => {
        const duration = Date.now() - startTime;
        if (duration > 100) { // Логируем запросы, которые выполняются дольше 100мс
          console.log({
            collection: collectionName,
            method,
            query: JSON.stringify(query),
            duration: `${duration}ms`,
            error: err ? err.message : null
          });
        }
      };
    });

    // Мониторинг использования памяти
    setInterval(() => {
      const memUsage = process.memoryUsage();
      console.log('Memory Usage:', {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
      });
    }, 60000); // Каждую минуту

    // Мониторинг состояния подключения
    setInterval(() => {
      const state = mongoose.connection.readyState;
      console.log('MongoDB Connection State:', {
        state,
        stateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][state]
      });
    }, 30000); // Каждые 30 секунд
  }
}; 