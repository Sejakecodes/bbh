import React from "react";
import { Flower2 } from "lucide-react";

export const RoseMark = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Flower2 size="100%" strokeWidth={1} color="#C8D8B0" aria-hidden="true" />
    </div>
  );
};
