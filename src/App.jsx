import { useState } from "react"
import "./App.css"
import { Button } from "@mui/material"
import UploadImageBase64 from "./components/UploadImageBase64"
import UploadImageFile from "./components/UploadImageFile"

function App() {
  const [imageFormat, setImageFormat] = useState("base64")

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
      {imageFormat === "base64" && <UploadImageBase64 />}
      {imageFormat === "file" && <UploadImageFile />}
    </div>
  )
}

export default App
