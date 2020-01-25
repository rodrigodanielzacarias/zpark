import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';

import './database';

import ip from 'ip';

console.dir(`Server IP:  ${ip.address()}`);
// console.dir(ip.address());

class App {
  constructor() {
    this.server = express();
    // this.localIp = ip.address();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
