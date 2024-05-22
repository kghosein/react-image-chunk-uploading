import { LinearProgress } from "@mui/material"
import { useState } from "react"

const chunkSize = 2 * 1024 * 1024 // 2mb

const UploadImageFile = () => {
  const [isChunkUploading, setIsChunkUploading] = useState(() => false)
  const [selectedImage, setSelectedImage] = useState(() => "")
  const [uploadProgress, setUploadProgress] = useState(() => 0)
  const [chunkInfo, setChunkInfo] = useState(() => null)
  const [uploadedImage, setUploadedImage] = useState(() => "")

  const handleUploadImg = (imageFile) => {
    try {
      const totalChunks = Math.ceil(imageFile.size / chunkSize)
      const chunkProgress = 100 / totalChunks
      let chunkNumber = 0
      let start = 0
      let end = chunkSize
      let counter = 1
      let chunkInfo
      let fileChunks = []

      const uploadChunk = () => {
        if (start < imageFile.size) {
          counter++
          const chunk = imageFile.slice(start, end)
          // your payload
          // const formData = new FormData()
          // formData.append("image_file", chunk)
          // formData.append("total_chunks", totalChunks)
          // formData.append("chunk_number", chunkNumber)
          chunkInfo = {
            chunkNumber: chunkNumber,
            totalChunks: totalChunks,
          }
          fileChunks.push(chunk)
          setChunkInfo(chunkInfo)
          setUploadProgress(Number((chunkNumber + 1) * chunkProgress))

          // handle your api here
          // your api must also support chunk uploading
          // do this in your api success response
          // simulating api response
          setTimeout(() => {
            setUploadProgress(Number((chunkNumber + 1) * chunkProgress))
            chunkNumber++
            start = end
            end = chunkSize * counter
            uploadChunk()
          }, 1200)
        } else {
          setIsChunkUploading(false)
          // setUploadProgress(0) // reset upload progress here or as required
          const blob = new Blob(fileChunks)
          const imageUri = URL.createObjectURL(blob)
          setUploadedImage(imageUri)
        }
      }

      uploadChunk()
    } catch (err) {
      console.log("error uploading image", err)
    }
  }

  const handleChange = async (e) => {
    setSelectedImage("")
    setUploadProgress(0)
    setChunkInfo(null)
    setUploadedImage("")
    const file = e.target.files[0]

    if (file) {
      const imageUri = URL.createObjectURL(file)
      setSelectedImage(imageUri)
      if (file.size < chunkSize) {
        setIsChunkUploading(false)
      } else {
        setIsChunkUploading(true)
      }
      handleUploadImg(file)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleChange(e)}
        onClick={(e) => {
          e.target.value = null
        }} // to allow user to select same image multiple times
      />
      <div className="selected-image">
        <h2>Selected Image</h2>
        {selectedImage && <img src={selectedImage} alt="" />}
      </div>
      <div className="uploaded-image">
        <h2>Image(to be) Uploaded</h2>
        {isChunkUploading && (
          <p>
            Chunk Info: {chunkInfo.chunkNumber}/{chunkInfo.totalChunks}
          </p>
        )}
        <div className="upload-progress">
          <p>Progress</p>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </div>
        {uploadedImage && <img src={uploadedImage} alt="" />}
      </div>
    </div>
  )
}

export default UploadImageFile
