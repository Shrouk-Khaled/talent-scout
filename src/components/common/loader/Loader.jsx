import { Spin } from "antd";

export const Loader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large"/>
    </div>
  );
};
