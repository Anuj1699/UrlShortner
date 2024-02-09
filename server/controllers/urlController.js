import { nanoid } from 'nanoid';
import { errorHandler } from '../middleware/error.js';
import url from './../modules/urlModule.js';

export const createShortUrl = async (req, res, next) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return next(errorHandler(400, "Url Not Found"));
    }
    try {
        const shortUrl = nanoid(8);
        const data = await url.create({
            shortId: shortUrl,
            redirectUrl: originalUrl,
            createdBy: req.user.id
        });
        return res.json(data.shortId);
    } catch (error) {
        next(error);
    }
}

export const searchUrl = async (req, res, next) => {
    const shortId = req.params.shortId;
    if (!shortId) {
        return next(errorHandler(400, "Not Valid Url"));
    }
    try {
        const entry = await url.findOneAndUpdate({ shortId },
            { $inc: { clicks: 1 } }, { new: true }
        );
        if (!entry) {
            return next(errorHandler(400, "Url not"));
        }
        res.redirect(entry.redirectUrl);
    } catch (error) {
        next(error);
    }
}

export const analytics = async (req, res, next) => {
    try {
        const data = await url.find({ createdBy: req.user.id });
        res.status(201).json({ data });
    } catch (error) {
        next(error);
    }
}

export const deleteUrl = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(errorHandler(400, "No Url Found"));
    }
    try {
        const findUrl = await url.findByIdAndDelete(id);
        if (!findUrl) {
            return next(errorHandler(404, "Url Not Found"));
        }
        return res.status(201).json({message: "Successfully Deleted"});
    } catch (error) {
        next(error);
    }
}
