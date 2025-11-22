"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./UploadFiles.module.scss";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { Progress } from "antd";

/**
 * Reusable upload/drop component
 *
 * Props:
 * - onFiles(files: FileList | File[])   REQUIRED
 * - accept: string                      e.g. "image/*,video/*,.pdf"
 * - multiple: boolean                   default: true
 * - maxSize: number (bytes)             optional soft limit
 * - dir: "rtl" | "ltr"                  default: "rtl"
 * - title: string                       grey line text
 * - cta: string                         blue clickable text
 * - icon: ReactNode                     optional custom icon
 * - disabled: boolean
 */
export default function UploadFiles({
  onFiles,
  accept = "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx",
  multiple = false,
  maxSize,
  dir = "rtl",
  title = "ارفع او اسحب فيديو (حتى دقيقتين) أو صورة لعرض أعمالك",
  cta = "اضغط للرفع",
  icon,
  disabled = false,
  files,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedMeta, setUploadedMeta] = useState(files || []);
  
  useEffect(() => {
    if (files && files.length > 0) {
      setUploadedMeta(files);
    }
  },[files])

  const handleOpen = () => {
    if (!disabled) inputRef.current?.click();
  };
  const passFiles = (files) => {
    if (!files?.length) return;

    // size check (optional)
    if (maxSize) {
      const tooBig = Array.from(files).find((f) => f.size > maxSize);
      if (tooBig) {
        setError(
          `الحجم الأكبر المسموح: ${(maxSize / (1024 * 1024)).toFixed(1)} م.ب`
        );
        return;
      }
    }

    const list = Array.from(files);

    const meta = list.map((file) => {
      const name = file.name || "untitled";
      const mime = file.type || "application/octet-stream";

      // try from filename first, then fallback to mime subtype
      const extFromName = name.includes(".") ? name.split(".").pop() : "";
      const extFromMime = mime.includes("/") ? mime.split("/").pop() : "";
      const ext = (extFromName || extFromMime || "").toLowerCase();

      return {
        name, // e.g. "Talent.mp4"
        ext, // e.g. "mp4"
        mime, // e.g. "video/mp4"
        sizeBytes: file.size, // e.g. 104857600
        sizeLabel: formatBytes(file.size), // e.g. "100MB"
        file, // keep original File
      };
    });

    setUploadedFiles(list);
    setUploadedMeta(meta);

    setError("");
    // pass both the raw files and the handy metadata
    onFiles?.(list, meta);
  };

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return "";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0,
      v = bytes;
    while (v >= 1024 && i < units.length - 1) {
      v /= 1024;
      i++;
    }
    return `${v >= 10 || v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}${units[i]}`;
  }

  const handleChange = (e) => passFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    passFiles(e.dataTransfer.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    if (e.type === "dragleave") setIsDragging(false);
  };

  return (
    <div dir={dir} className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ""} ${
          disabled ? styles.disabled : ""
        }`}
        onClick={handleOpen}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        aria-disabled={disabled}
        aria-label={title}
      >
        <div className={styles.inner}>
          <div className={styles.icon} aria-hidden="true">
            <Image
              src="/images/icons/upload.svg"
              alt="Upload Icon"
              width={30}
              height={30}
            />
          </div>

          <p className={styles.title}>{title}</p>

          <span className={styles.cta} role="link" tabIndex={-1}>
            {cta}
          </span>

          <input
            ref={inputRef}
            className={styles.input}
            type="file"
            accept={accept}
            onChange={handleChange}
            multiple={multiple}
            disabled={disabled}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      </button>

      {uploadedMeta.length > 0 &&
        uploadedMeta?.map((obj, i) => (
          <div className={styles.fileDetails} key={i}>
            <div className={styles.info}>
              <div className={styles.cancelUpload}>
                <AiOutlineClose color="black" onClick={() => {
                    setUploadedFiles([]);
                    setUploadedMeta([]);
                    onFiles?.([], []);
                }}/>
                {/* <p>40%</p> */}
              </div>
              <div className={styles.nameSize}>
                <h3>{obj?.name}</h3>
                <p>{formatBytes(obj?.size)}</p>
              </div>
            </div>
            {/* <div className={styles.progress}>
              <Progress
                percent={40}
                showInfo={false}
                size={"small"}
                trailColor="#F3F3F3"
                strokeColor={"#004AAD"}
              />
            </div> */}
          </div>
        ))}

      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
}
