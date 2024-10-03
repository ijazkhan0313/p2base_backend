
import fastify from 'fastify';
import { databaseConnexion } from './src/services/database.service';
import { getData, p2bAdsEventsArray } from './src/services/data.services';
import fastifyJwt from '@fastify/jwt'
import dotenv from 'dotenv';
import multer from 'fastify-multer';
import cron from 'node-cron';
import path from 'path';
import { p2bFreeEventsArray } from './src/services/data.services';
import { newsEvents, categorie1, categorie2, categorie3, categorie4, categorie5, categorie6, categorie7, categorie8, categorie9, categorie10 } from './src/services/data.filter';
dotenv.config({path: __dirname + '/.env'});

export const server = fastify({logger:true,
  bodyLimit: 100 * 1024 * 1024});
databaseConnexion();
server.register(fastifyJwt, {secret: process.env.JWT_SECRET! });
server.register(multer.contentParser);


server.register(require('@fastify/cors'), (instance) => {
  return (req: any,callback : any)  => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: "*",
      methods: ['GET, POST, PUT, DELETE, PATCH, OPTIONS'],
      allowedHeaders: ['Origin, X-Requested-With, Content, Accept, Content-Type, Authorization']
    };
    callback(null, corsOptions)
  }
})


exports.server.register(require('@fastify/cors'), {
  origin: (origin : any, cb: any) => {
      // Allow your frontend origin (adjust as necessary)
      if (origin === 'https://p2base.vercel.app' || !origin) {
          cb(null, true);
      } else {
          cb(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
  preflightContinue: false,  // Let the browser handle OPTIONS
  optionsSuccessStatus: 204, // Handle the OPTIONS response
});




server.register(require('@fastify/static'), {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', // optional: default '/'
})
//TODO Add getting satic img to controllers
server.get('/events/:filename', (req: any,rep: any) => {
  const filename = req.params.filename
  rep.sendFile(`/events/${filename}`)
})
cron.schedule("30 6 * * *", function(){
  getData();
  console.log('________________________');
});
//p2bFreeEventsArray();
//p2bAdsEventsArray()
cron.schedule("45 6 * * *", function(){
  newsEvents();
  categorie1();
  categorie2();
  categorie3();
  categorie4();
  categorie5();
  categorie6();
  categorie7();
  categorie8();
  categorie9();
  categorie10();
});


server.register(require('./src/routes/eventsRoutes'));
server.register(require('./src/routes/usersRoutes'));
server.register(require('./src/routes/couponsRoutes'));
server.register(require('./src/routes/statsRoutes'));
server.register(require('./src/routes/settingsRoutes'));


server.get('/', async (req, rep) => {
  rep.status(200).send(`🌎 Serveur en Ligne 🌏`)
})


server.listen({port: Number(process.env.PORT)},function(err: any, address: any) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🟢  Server listening at ${address}`)
});


