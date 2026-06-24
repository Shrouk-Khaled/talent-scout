"use client";

import React, { useRef, useState } from "react";
import { Modal, Avatar, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "./CreatePostModal.module.scss";
import Button from "@/components/ui/button/Button";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import { useTranslations } from "next-intl";

const { TextArea } = Input;

export default function CreatePostModal({
  open,
  onClose,
  onSubmit,
  avatarSrc,
  submitting = false,
  submitDisabled = false,
}) {
  const t = useTranslations("feed.createPost");

  const fileInputRef = useRef(null);

  const user = useUserStore((state) => state.info);

  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);

  const resetModal = () => {
    setBody("");

    setAttachments((prev) => {
      prev.forEach((attachment) => {
        if (attachment.url) URL.revokeObjectURL(attachment.url);
      });

      return [];
    });

    onClose();
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const mapped = files
      .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
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

    setAttachments(mapped);

    e.target.value = "";
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);

      if (target?.url) {
        URL.revokeObjectURL(target.url);
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  const clearStates = () => {
    setBody("");

    setAttachments((prev) => {
      prev.forEach((attachment) => {
        if (attachment.url) URL.revokeObjectURL(attachment.url);
      });

      return [];
    });
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      onCancel={resetModal}
      centered
      width={700}
      destroyOnHidden
      className={styles.modal}
      styles={{
        content: { padding: 0, overflow: "hidden" },
      }}
    >
      <div className={styles.container}>
        <button
          className={styles.closeBtn}
          onClick={resetModal}
          aria-label={t("close")}
        >
          <CloseOutlined />
        </button>

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

        <div className={styles.body}>
          <TextArea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("textareaPlaceholder")}
            autoSize={false}
            className={styles.textarea}
            bordered={false}
            rows={8}
            style={{ resize: "none" }}
          />

          {attachments.length > 0 && (
            <div className={styles.previews}>
              {attachments.map((attachment) => (
                <div key={attachment.id} className={styles.previewItem}>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeAttachment(attachment.id)}
                    aria-label={t("removeFile")}
                  >
                    <CloseOutlined />
                  </button>

                  {attachment.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={attachment.url}
                      alt={attachment.file?.name || t("attachmentAlt")}
                      className={styles.previewMedia}
                    />
                  ) : (
                    <video
                      className={styles.previewMedia}
                      src={attachment.url}
                      controls
                      preload="metadata"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            type="primary"
            className={styles.publishBtn}
            onClick={() => {
              onSubmit(body, attachments, clearStates);
            }}
            loading={submitting}
            disabled={
              submitDisabled ||
              !body.trim() ||
              attachments.length === 0 ||
              submitting
            }
            style={{ minWidth: "40%" }}
          >
            {t("publish")}
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
            <Image
              src="/images/icons/gallery-add.svg"
              width={20}
              height={20}
              alt={t("galleryIconAlt")}
            />

            <span>
              {t("addMedia")} <span style={{ color: "red" }}>*</span>
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}