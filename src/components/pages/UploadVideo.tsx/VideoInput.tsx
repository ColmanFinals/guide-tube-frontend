import React, { useRef, useState, ChangeEvent } from "react";

type VideoInputProps = {
  width: string;
  height: string;
};

export default function VideoInput(props: VideoInputProps) {
  const { height } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [source, setSource] = useState<string | undefined>(undefined);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setSource(url);
    }
  };

  const handleChoose = () => {
    inputRef.current?.click();
  };

  return (
    <div className="VideoInput">
      <input
        ref={inputRef}
        className="VideoInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
      />
      {!source && <button onClick={handleChoose}>Choose</button>}
      {source && (
        <video
          className="VideoInput_video"
          width="100%"
          height={height}
          controls
          src={source}
        />
      )}
      <div className="VideoInput_footer">{source || "Nothing selected"}</div>
    </div>
  );
}
