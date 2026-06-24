import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage,getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    registerUserSchema,
    loginUserSchema,
    changePasswordSchema,
    updateAccountSchema,
} from "../validators/user.validator.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
const router = Router();

router.route("/register").post(
    authLimiter,
    upload.fields([
        {
            name : "avatar",
            maxCount: 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    validate(registerUserSchema),
    registerUser)

router.route("/login").post(authLimiter,
    validate(loginUserSchema),
    loginUser)
//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

    router.route("/change-password").post(
    validate(changePasswordSchema),
    verifyJWT,
    changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(
    validate(updateAccountSchema),
    verifyJWT,
    updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)
export default router;
