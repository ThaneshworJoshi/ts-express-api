import express from 'express';
import config from 'config';
import log from './logger';
import connect from './db/connect';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';

const port = config.get('port') as number;
const host = config.get('host') as string;

const app = express();
app.use(deserializeUser);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect();
routes(app);

app.listen(port, host, () => {
  log.info(`Server listining on http://${host}:${port}`);
});
