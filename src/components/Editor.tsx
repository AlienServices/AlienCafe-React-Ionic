import { IonPage, IonButton, IonContent } from "@ionic/react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../pages/Tab1.css";

const Editor = ({
  value,
  setValue,
  theme,
  toolBar,
}: {
  value: string;
  setValue: (value: string) => void;
  theme: string;
  toolBar: boolean;
}) => {
  // const [value, setValue] = useState('');

  return (
    <div>
      <div className="quillCenter">

        {toolBar ? (
          <ReactQuill
            modules={{
              toolbar: {
                container: [
                  [{ header: "1" }, { header: "2" }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  ["link", "image"],
                ],
                // handlers: {
                //   image: imageHandler()
                // }
              },
            }}
            theme={`${theme}`}
            value={value}
            onChange={setValue}
          />
        ) : (
          <ReactQuill theme={`${theme}`} value={value} onChange={setValue} />
        )}
      </div>
    </div>
  );
};

export default Editor;
