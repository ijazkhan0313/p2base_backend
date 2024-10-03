"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const database_service_1 = require("./src/services/database.service");
const data_services_1 = require("./src/services/data.services");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const data_filter_1 = require("./src/services/data.filter");
dotenv_1.default.config({ path: __dirname + '/.env' });
exports.server = (0, fastify_1.default)({ logger: true,
    bodyLimit: 100 * 1024 * 1024 });
(0, database_service_1.databaseConnexion)();
exports.server.register(jwt_1.default, { secret: process.env.JWT_SECRET });
exports.server.register(fastify_multer_1.default.contentParser);
exports.server.register(require('@fastify/cors'), (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: "*",
            methods: ['GET, POST, PUT, DELETE, PATCH, OPTIONS'],
            allowedHeaders: ['Origin, X-Requested-With, Content, Accept, Content-Type, Authorization']
        };
        callback(null, corsOptions);
    };
});
exports.server.register(require('@fastify/static'), {
    root: path_1.default.join(__dirname, 'uploads'),
    prefix: '/uploads/', // optional: default '/'
});
//TODO Add getting satic img to controllers
exports.server.get('/events/:filename', (req, rep) => {
    const filename = req.params.filename;
    rep.sendFile(`/events/${filename}`);
});
node_cron_1.default.schedule("30 6 * * *", function () {
    (0, data_services_1.getData)();
    console.log('________________________');
});
//p2bFreeEventsArray();
//p2bAdsEventsArray()
node_cron_1.default.schedule("45 6 * * *", function () {
    (0, data_filter_1.newsEvents)();
    (0, data_filter_1.categorie1)();
    (0, data_filter_1.categorie2)();
    (0, data_filter_1.categorie3)();
    (0, data_filter_1.categorie4)();
    (0, data_filter_1.categorie5)();
    (0, data_filter_1.categorie6)();
    (0, data_filter_1.categorie7)();
    (0, data_filter_1.categorie8)();
    (0, data_filter_1.categorie9)();
    (0, data_filter_1.categorie10)();
});
exports.server.register(require('./src/routes/eventsRoutes'));
exports.server.register(require('./src/routes/usersRoutes'));
exports.server.register(require('./src/routes/couponsRoutes'));
exports.server.register(require('./src/routes/statsRoutes'));
exports.server.register(require('./src/routes/settingsRoutes'));
exports.server.get('/', async (req, rep) => {
    rep.status(200).send(`🌎 Serveur en Ligne 🌏`);
});
exports.server.listen({ port: Number(process.env.PORT) }, function (err, address) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`🟢  Server listening at ${address}`);
});
