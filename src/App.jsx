import { useState } from "react"
import "./App.css"
import { LinearProgress } from "@mui/material"

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
  const [image, setImage] = useState(() => "")
  const [uploadProgress, setUploadProgress] = useState(() => 0)
  const [chunkInfo, setChunkInfo] = useState(() => null)

  const handleUploadImg = (imageBase64) => {
    try {
      const totalChunks = Math.ceil(imageBase64.length / chunkSize)
      const chunkProgress = 100 / totalChunks
      let chunkNumber = 0
      let start = 0
      let end = chunkSize
      let counter = 1
      let chunkInfo

      const uploadChunk = () => {
        if (start < imageBase64.length) {
          counter++
          // const chunk = imageBase64.substring(start, end)
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
          }, 2000)
        } else {
          setIsChunkUploading(false)
          setUploadProgress(0)
        }
      }

      uploadChunk()
    } catch (err) {
      console.log("error uploading image", err)
    }
  }

  const handleChange = async (e) => {
    const file = e.target.files[0]

    if (file) {
      const imageUri = URL.createObjectURL(file)

      await getBase64(file)
        .then((res) => {
          if (file.size < chunkSize) {
            setImage(imageUri)
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
      <input
        type="file"
        onChange={(e) => handleChange(e)}
        onClick={(e) => {
          e.target.value = null
        }} // to allow user to select same image multiple times
      />
      <div>
        <h2>Original Image</h2>
        <img src={image} alt="" />
      </div>
      <div>
        {isChunkUploading ? (
          <>
            <h2>Uploading image in chunks</h2>
            <p>
              Chunks {chunkInfo.chunkNumber}/{chunkInfo.totalChunks}
            </p>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </>
        ) : (
          <>
            <h2>Reconstructed Image</h2>
            <img src={image} alt="" />
          </>
        )}
      </div>
    </div>
  )
}

export default App
