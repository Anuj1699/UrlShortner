import express from "express";
import { analytics, createShortUrl, deleteUrl, searchUrl } from "../controllers/urlController.js";
import { verifyToken } from "../middleware/auth.js";

const route = express.Router();

route.post('/create', verifyToken, createShortUrl);
route.get('/:shortId', searchUrl);
route.get('/analytics/data', verifyToken, analytics);
route.delete('/delete/:id', verifyToken, deleteUrl);

export default route;

