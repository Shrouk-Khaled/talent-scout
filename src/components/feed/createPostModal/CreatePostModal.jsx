"use client";

import React, { useRef, useState } from "react";
import { Modal, Avatar, Input } from "antd";
import { CloseOutlined, PlusSquareOutlined } from "@ant-design/icons";
import styles from "./CreatePostModal.module.scss";
import Button from "@/components/ui/button/Button";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";

const { TextArea } = Input;

export default function CreatePostModal({
  open,
  onClose,
  onSubmit,
  avatarSrc,
  submitting = false,
  submitDisabled = false,
}) {
  //refs
  const fileInputRef = useRef(null);
  //store
  const user = useUserStore((state) => state.info);
  //states
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);

  //functions
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped = files
      .filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"))
      .map((file) => {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith("image/") ? "image" : "video";
        return {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          file,
          url,
          type,
        };
      });

    // setAttachments((prev) => [...prev, ...mapped]);
    setAttachments(mapped)

    // allow re-selecting same file again
    e.target.value = "";
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((x) => x.id !== id);
    });
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      onCancel={() => {
        setBody("");
        setAttachments((prev) => {
          prev.forEach((a) => a.url && URL.revokeObjectURL(a.url));
          return [];
        });
        onClose();
      }}
      centered
      width={700}
      destroyOnHidden
      className={styles.modal}
      styles={{
        content: { padding: 0, overflow: "hidden" },
      }}
    >
      <div className={styles.container}>
        {/* Close button (top-left like screenshot) */}
        <button
          className={styles.closeBtn}
          onClick={() => {
            setBody("");
            setAttachments((prev) => {
              prev.forEach((a) => a.url && URL.revokeObjectURL(a.url));
              return [];
            });
            onClose();
          }}
          aria-label="إغلاق"
        >
          <CloseOutlined />
        </button>

        {/* Header right (avatar + name) */}
        <div className={styles.header}>
          <Avatar className={styles.avatar} size={44} src={avatarSrc}>
            {!avatarSrc ? user?.user?.first_name?.[0] : null}
          </Avatar>
          <div className={styles.userBlock}>
            <div className={styles.userName}>
              {user?.user?.first_name} {user?.user?.last_name}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <TextArea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="اكتب هنا *"
            autoSize={false}
            className={styles.textarea}
            bordered={false}
            rows={8}
            style={{ resize: "none" }}
          />

          {attachments.length > 0 && (
            <div className={styles.previews}>
              {attachments.map((a) => (
                <div key={a.id} className={styles.previewItem}>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeAttachment(a.id)}
                    aria-label="حذف الملف"
                  >
                    <CloseOutlined />
                  </button>

                  {a.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.url}
                      alt={a.file?.name || "attachment"}
                      className={styles.previewMedia}
                    />
                  ) : (
                    <video
                      className={styles.previewMedia}
                      src={a.url}
                      controls
                      preload="metadata"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            type="primary"
            className={styles.publishBtn}
            onClick={() => {
              onSubmit(body, attachments);
            }}
            loading={submitting}
            disabled={submitDisabled || !body.trim() || attachments.length === 0 || submitting}
            style={{ minWidth: "40%" }}
          >
            نشر
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={onFilesSelected}
          />

          <button
            className={styles.attachBtn}
            type="button"
            onClick={openFilePicker}
          >
            <Image src={"/images/icons/gallery-add.svg"} width={20} height={20} alt="icon"/>
            <span>أضف صورة أو فيديو <span style={{color: "red"}}>*</span></span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
