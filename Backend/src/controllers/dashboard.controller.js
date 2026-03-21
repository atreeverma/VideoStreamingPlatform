import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user._id

    // Total Videos
    const totalVideos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $count: "totalVideos"
        }
    ]);

    const videoCount = totalVideos.length > 0 ? totalVideos[0].totalVideos : 0;


    // Total Views
    const totalViewsResult = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const totalViews = totalViewsResult[0]?.totalViews || 0

    // Total Subscribers
    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    })

    // Total Likes
    const total = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likescount: {
                    $size: "$likes"
                }
            }
        },
        {
            $group: {
                _id: null,
                totallikes: {
                    $sum: "$likescount"
                }
            }
        }
    ])
    const Likes = total.length > 0 ? total[0].totallikes : 0;


    return res.status(200).json(
        new ApiResponse(200, {
            videoCount,
            totalViews,
            totalSubscribers,
            Likes
        }, "Channel stats fetched successfully")
    )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                totalLikes: {
                    $size: "$likes"
                }
            }
        },
        {
            $project: {
                likes: 0
            }
        },{
            $sort: {
                createdAt: -1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }