import { LinearProgress } from "@mui/material"
import { useState } from "react"

const chunkSize = 2 * 1024 * 1024 // 2mb

async function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
  })
}

const UploadImageBase64 = () => {
  const [isChunkUploading, setIsChunkUploading] = useState(() => false)
  const [selectedImage, setSelectedImage] = useState(() => "")
  const [uploadProgress, setUploadProgress] = useState(() => 0)
  const [chunkInfo, setChunkInfo] = useState(() => null)
  const [uploadedImage, setUploadedImage] = useState(() => "")

  const handleUploadImg = (imageBase64) => {
    try {
      const totalChunks = Math.ceil(imageBase64.length / chunkSize)
      const chunkProgress = 100 / totalChunks
      let chunkNumber = 0
      let start = 0
      let end = chunkSize
      let counter = 1
      let chunkInfo
      let fileChunks = []

      const uploadChunk = () => {
        if (start < imageBase64.length) {
          counter++
          const chunk = imageBase64.substring(start, end)
          // your payload
          // const payload = {
          //   image_data: chunk,
          //   total_chunks: totalChunks,
          //   chunk_number: chunkNumber,
          // }
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
          setUploadedImage(fileChunks.join(""))
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

      await getBase64(file)
        .then((res) => {
          if (file.size < chunkSize) {
            setIsChunkUploading(false)
          } else {
            setIsChunkUploading(true)
          }
          handleUploadImg(res)
        })
        .catch((err) => {
          console.log("error converting image to base64 format", err)
        })
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

export default UploadImageBase64
