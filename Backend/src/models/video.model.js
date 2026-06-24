import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile : {
            type : String,//cloudinary Url
            required : true
        },
        thumbnail : {
            type : String,//cloudinary url
            required : true
        },
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        duration : {
            type : Number,
            required : true
        },
        views : {
            type : Number,
            default : 0
        },
        isPublished : {
            type : Boolean,
            default : true
        },
        status: {
            type: String,
            enum: ["processing", "published", "failed"],
            default: "published",
        },
        processingError: {
            type: String,
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }

    },
    {timestamps : true}
)
videoSchema.index({ owner: 1, createdAt: -1 });
videoSchema.index({ title: "text", description: "text" });
videoSchema.index({ isPublished: 1, createdAt: -1 });
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema)