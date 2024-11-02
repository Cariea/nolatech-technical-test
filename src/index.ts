import express, { Request, Response } from 'express';
import { PORT } from './config/environment';


const port = PORT || 3000
const app = express();
app.get('/', (req: Request, res: Response) => {
  console.log('GET', req.url);
  res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});