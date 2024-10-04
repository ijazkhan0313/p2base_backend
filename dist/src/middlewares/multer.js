"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsUpload = void 0;
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const path_1 = __importDefault(require("path"));
const storage = fastify_multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, path_1.default.join(__dirname, '../../uploads/events'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "video/mp4" ||
        file.mimetype === "video/mpeg" ||
        file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(new Error(`invalid file, expected type jpg/jpeg/png/mp4/mpeg`), false);
    }
};
const upload = (0, fastify_multer_1.default)({ storage: storage, fileFilter: fileFilter });
const fieldsUpload = upload.single('file');
exports.fieldsUpload = fieldsUpload;
