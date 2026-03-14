"use client";

import React from "react";
import { Modal, Button } from "antd";
import styles from "./AppModal.module.scss";

const SIZE_TO_WIDTH = {
  sm: 420,
  md: 520,
  lg: 720,
  xl: 920,
};

export default function AppModal({
  open,
  title,
  children,

  onClose,
  onConfirm,

  confirmText = "Save",
  cancelText = "Cancel",
  confirmLoading = false,
  confirmDisabled = false,

  size = "md",
  footerVariant = "default", // "default" | "none" | "custom"
  footerExtra = null, // left side node
  footerRender = null, // function returning custom footer

  centered = true,
  destroyOnHidden = true,
  maskClosable = false,
  keyboard = false,

  className = "",
  ...rest
}) {
  const width = SIZE_TO_WIDTH[size] ?? SIZE_TO_WIDTH.md;

  const footer =
    footerVariant === "none"
      ? null
      : footerVariant === "custom"
        ? footerRender?.()
        : (
            <div className={styles.footer}>
              <div className={styles.footerLeft}>{footerExtra}</div>

              <div className={styles.footerRight}>
                <Button onClick={onClose} disabled={confirmLoading}>
                  {cancelText}
                </Button>

                <Button
                  type="primary"
                  onClick={onConfirm}
                  loading={confirmLoading}
                  disabled={confirmDisabled || !onConfirm}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          );

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={footer}
      centered={centered}
      destroyOnHidden={destroyOnHidden}
      maskClosable={maskClosable}
      keyboard={keyboard}
      width={width}
      className={`${styles.modal} ${className}`}
      {...rest}
    >
      <div className={styles.body}>{children}</div>
    </Modal>
  );
}