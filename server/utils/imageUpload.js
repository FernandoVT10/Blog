import multer from "multer";

import { IMAGES_URL } from "../config/constants";
import { unlinkSync } from "fs";

export function uploadImage(field, url) {
    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, IMAGES_URL + url);
        },
        filename: (_req, _file, cb) => {
            cb(null, Date.now() + ".jpg");
        }
    });

    return (req, res, next) => {
        const upload = multer({
            storage,
            fileFilter: (_req, file, cb) => {
                const ext = file.mimetype;
        
                if(ext !== "image/png"
                && ext !== "image/jpg"
                && ext !== "image/jpeg"
                && ext !== "image/gif") {
                    cb({
                        status: 200,
                        message: `The ${field} must be an image`
                    });
                }
        
                cb(null, true);
            }
        }).single(field);
    
        upload(req, res, error => {
            if(error) {
                res.json({ errors: [error] });
            } else {
                next();
            }
        });
    }
}

export function uploadImages(field, url) {
    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, IMAGES_URL + url);
        },
        filename: (_req, _file, cb) => {
            cb(null, Date.now() + ".jpg");
        }
    });

    return (req, res, next) => {
        const upload = multer({
            storage,
            fileFilter: (_req, file, cb) => {
                const ext = file.mimetype;
        
                if(ext !== "image/png"
                && ext !== "image/jpg"
                && ext !== "image/jpeg"
                && ext !== "image/gif") {
                    cb({
                        status: 200,
                        message: `Field '${field}' should only contain images`
                    });
                }
        
                cb(null, true);
            }
        }).array(field);
    
        upload(req, res, error => {
            if(error) {
                res.json({ errors: [error] });
            } else {
                next();
            }
        });
    }
}

export function deleteImage(url) {
    unlinkSync(IMAGES_URL + url);
}