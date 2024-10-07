// server.ts
import app from './app';


const PORT = process.env.PORT || 8082;

const httpServer = require('http').createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
