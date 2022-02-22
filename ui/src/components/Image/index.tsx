import React, { FC } from "react";

interface ImageProps {
  src: string | undefined;
  width: string | number | undefined;
  height: string | number | undefined;
  [x: string]: any;
}

const Image: FC<ImageProps> = ({ src, width, height, ...rest }) => {
  return (
    <div>
      <img
        src={src}
        width={width}
        height={height}
        placeholder="empty"
        {...rest}
      />
    </div>
  );
};

export default Image;
