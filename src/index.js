import 'dotenv/config.js';
import { initMongoDB } from './db/initMongoDB.js';
import { createServer } from './server.js';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await initMongoDB();
  const app = createServer();

  app.listen(PORT, () => {
    console.log(`🚀  Сервер запущено на порту ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Не вдалося запустити сервер:', error.message);
  process.exit(1);
});
