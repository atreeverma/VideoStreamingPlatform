import {useState} from "react"
import { uploadVideo } from "../api/videoApi"
function UploadVideo() {
    const [form,setForm] = useState({
        title: "",
        description: ""
    })
    const [files,setFiles] = useState({
        video: null,
        thumbnail: null
    })
    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!form.title || !files.video || !files.thumbnail){
            alert("All fields required")
            return
        }
        try {
            const formData = new FormData()
            formData.append("title",form.title);
            formData.append("description",form.description)
            formData.append("videoFile",files.video)
            formData.append("thumbnail",files.thumbnail)

            await uploadVideo(formData)
            alert("Video uploaded successfully")
        } catch (error) {
            console.log("Upload failed",error);
            
        }
    }
    return (
        <div className="upload-page">
            <h2>Upload Video</h2>
            <form onSubmit={handleSubmit} className="upload-form">
               <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({...form,title: e.target.value})}
                />
                <textarea 
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({...form,description: e.target.value})} 
                />
                <div>
                    <label>Video File</label>
                    <input
                        type="file"
                        onChange={(e) => setFiles({...files,video: e.target.value})}
                    />
                </div>
                <div>
                    <label>Thumbnail</label>
                    <input 
                        type="file"
                        onChange={(e) => setFiles({...files,thumbnail: e.target.value})}
                    />
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}
export default UploadVideo;