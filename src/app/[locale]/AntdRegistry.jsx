"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

export default function AntdRegistry({ children }) {
  const cacheRef = useRef(createCache());

  useServerInsertedHTML(() => {
    const css = extractStyle(cacheRef.current, true);
    return <style id="antd" dangerouslySetInnerHTML={{ __html: css }} />;
  });

  return (
    <StyleProvider cache={cacheRef.current} hashPriority="high">
      {children}
    </StyleProvider>
  );
}
