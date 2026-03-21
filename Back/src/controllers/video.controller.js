import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const matchStage = {}
    if(query){
        matchStage.title = { 
            $regex: query,
            $options: "i"
        }
    }
    if(userId && isValidObjectId(userId)){
        matchStage.owner = new mongoose.Types.ObjectId(userId)
    }
    const sortOrder = sortType === "asc" ? 1 : -1
    const videos = await Video.aggregate([
        {
            $match: matchStage
        },
        {
            $sort: {
                [sortBy]: sortOrder
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: parseInt(limit)
        }
    ])
    return res
            .status(200)
            .json(new ApiResponse(200,videos,"Videos fetched Successfully"))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if(!title || !description){
        throw new ApiError(400,"Title and description are required")
    }
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if(!videoFileLocalPath){
        throw new ApiError(400,"Video file is required")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail =await uploadOnCloudinary(thumbnailLocalPath);
    if(!videoFile || !thumbnail){
        throw new ApiError(500,"Error while uploading video");
    }
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration || 0,
        owner: req.user._id
    })
    return res 
            .status(201)
            .json(new ApiResponse(201,video,"Video published successfully"))
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"Video not found")
    }
    video.views += 1;
    await video.save()

    return res
            .status(200)
            .json(new ApiResponse(200,video,"Video fetched Successfully"))
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const  {title,description} = req.body

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video Not found")
    }

    if(video.owner.toString() !== req.user._id.toString())
    {
        throw new ApiError(403,"Invalid Access")
    }

    if(title){
        video.title = title
    }
    if(description){
        video.description = description
    }

    if(req.file?.path){
        const thumbnail = await uploadOnCloudinary(req.file.path)
        video.thumbnail = thumbnail.url
    }
    await video.save()
    return res
            .status(200)
            .json(new ApiResponse(200,video,"Video updated successfully"))
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId))
    {
        throw new ApiError(400,"Invalid Video Id")
    }
    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(404,"Video not found")
    }

    if(video.owner.toString() !== req.user._id.toString())
    {
        throw new ApiError(403,"Unauthorized to delete video")
    }

    await Video.findByIdAndDelete(videoId)

    return res
            .status(200)
            .json(new ApiResponse(200,{},"Video deleted successfully"))
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized action")
    }

    video.isPublished = !video.isPublished

    await video.save()

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Publish status toggled"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}