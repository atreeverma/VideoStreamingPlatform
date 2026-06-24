import multer from "multer";

const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,"./public/temp")
    },
    filename : function (req,file,cb){
        const safeName = file.originalname.replace(/\s+/g, "-");
        cb(null,`${Date.now()}-${safeName}`)
    }
})
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
];
const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new ApiError(400, "Invalid file type"));
    }

    cb(null, true);
};
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024,
    },
})