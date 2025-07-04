import {useRef} from "react";
import axios from "axios";

const chunkSize = 20 * 1024

export function SliceUpload() {
  const fileInput = useRef<HTMLInputElement>(null);

  async function onFileChange() {
    const file = fileInput.current?.files?.[0] as File

    const chunks = []
    let startPos = 0

    while (startPos < file?.size) {
      chunks.push(file.slice(startPos, startPos + chunkSize))
      startPos += chunkSize;
    }
    const radomStr = Math.random().toString(36).slice(2, 8);

    const requests = chunks.map((chunk, index) => {
      const data = new FormData()
      data.set('name', radomStr + '-' + file.name + '-' + index)
      data.append('files', chunk)
      return axios.post('http://localhost:3000/slice-upload/upload', data)
    })

    await Promise.all(requests)

    // 合并请求

    axios.get(`http://localhost:3000/slice-upload/merge?name=${radomStr + '-' + file.name}`)


  }

  return <>
    <input ref={fileInput} type="file" onChange={onFileChange}/>
  </>
}