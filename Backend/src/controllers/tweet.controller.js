import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    if(!content.trim()){
        throw new ApiError(400,"Content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    return res  
            .status(201)
            .json(new ApiResponse(201,tweet,"Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }
    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }

    ])

    return res
            .status(200)
            .json(new ApiResponse(200,tweets,"User tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet Id")
    }
    if(!content?.trim()){
        throw new ApiError(400,"Content is required")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"Unauthorized to update this tweet")
    }
    tweet.content = content
    await tweet.save()

    return res
            .status(200)
            .json(new ApiResponse(200,tweet,"Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }
    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"Unauthorized to delete this tweer")
    }
    await tweet.deleteOne()

    return res
            .status(200)
            .json(new ApiResponse(200,{},"Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}