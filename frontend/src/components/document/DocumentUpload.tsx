import { useState } from "react"

import {
  uploadDocument,
} from "../../services/document"

export default function DocumentUpload() {

  const [file, setFile] =
    useState<File | null>(
      null
    )

  const [loading, setLoading] =
    useState(false)

  const handleUpload =
    async () => {

      if (!file) {

        alert(
          "Please select a document"
        )

        return

      }

      try {

        setLoading(true)

        const userId =
          localStorage.getItem(
            "user_id"
          ) || ""

        const result =
          await uploadDocument(
            file,
            userId
          )

        console.log(
          "Upload Result:",
          result
        )

        alert(
          "Document Uploaded Successfully"
        )

        setFile(null)

      } catch (error) {

        console.error(
          "UPLOAD ERROR:",
          error
        )

        alert(
          "Upload Failed"
        )

      } finally {

        setLoading(false)

      }

    }

  return (

    <div className="border-b border-zinc-800 p-4 bg-zinc-900">

      <div className="flex flex-col gap-3">

        <div className="flex items-center gap-3">

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {

              const selected =
                e.target.files?.[0] ||
                null

              setFile(
                selected
              )

            }}
            className="text-white"
          />

          <button
            onClick={
              handleUpload
            }
            disabled={
              loading
            }
            className="
              bg-blue-600
              hover:bg-blue-500
              disabled:bg-zinc-700
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            {
              loading
                ? "Uploading..."
                : "Upload"
            }
          </button>

        </div>

        {file && (

          <div className="text-sm text-green-400">

            📄 Selected:
            {" "}
            {file.name}

          </div>

        )}

      </div>

    </div>

  )

}