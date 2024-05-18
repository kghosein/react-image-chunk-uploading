import { useState } from "react"
import "./App.css"
import { Button, LinearProgress } from "@mui/material"

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

function App() {
  const [isChunkUploading, setIsChunkUploading] = useState(() => false)
  const [selectedImage, setSelectedImage] = useState(() => "")
  const [uploadProgress, setUploadProgress] = useState(() => 0)
  const [chunkInfo, setChunkInfo] = useState(() => null)
  const [uploadedImage, setUploadedImage] = useState(() => "")
  const [imageFormat, setImageFormat] = useState("base64")

  const handleUploadImg = (imageBase64) => {
    try {
      const totalChunks = Math.ceil(imageBase64.length / chunkSize)
      const chunkProgress = 100 / totalChunks
      let chunkNumber = 0
      let start = 0
      let end = chunkSize
      let counter = 1
      let chunkInfo
      let myChunks = []

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
          myChunks.push(chunk)
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
          // setUploadProgress(0)
          setUploadedImage(myChunks.join(""))
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
    <div className="container">
      <h2>Image Chunk Uploading</h2>
      <div className="format-selection">
        <Button
          variant="outlined"
          size="small"
          onClick={() => setImageFormat("base64")}
          disabled={imageFormat === "base64" ? true : false}
        >
          base64 format
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setImageFormat("file")}
          disabled={imageFormat === "file" ? true : false}
        >
          file format
        </Button>
      </div>
      <h3>***{imageFormat} format***</h3>
      {imageFormat === "base64" && (
        <>
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
        </>
      )}
      {imageFormat === "file" && <h2>Will be updated Soon</h2>} 
    </div>
  )
}

export default App
