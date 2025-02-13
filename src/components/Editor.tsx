import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../theme/create.css";
import { IonFooter, useIonViewWillLeave } from "@ionic/react";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs

const Editor = ({
  value,
  setValue,
  styling,
  description
}: {
  value: string;
  styling: string
  setValue: (value: string) => void;
  description: string
}) => {
  const contentQuillRef = useRef<ReactQuill | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [toolbarId] = useState(`toolbar-${uuidv4()}`); // Generate a unique ID for the toolbar

  const handleReplyClick = (e: boolean) => {
    setIsReplying(e);
    setTimeout(() => {
      contentQuillRef.current?.getEditor();
    }, 400);
  };
  useIonViewWillLeave(() => {
    setValue('')
  })

  return (
    <div>
      <div className="quillCenter">
        <ReactQuill
          onFocus={() => {
            handleReplyClick(true);
          }}
          onBlur={() => {
            handleReplyClick(false);
          }}
          className={`${styling}`}
          ref={contentQuillRef}
          value={value}
          placeholder={description}
          onChange={(newValue) => setValue(newValue)}
          modules={{
            toolbar: {
              container: `#${toolbarId}`, // Use the unique toolbar ID
            },
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "link",
            "image",
            "video",
            "code-block",
            "list",
            "bullet",
            "indent",
          ]}
        />
      </div>
      <IonFooter className={isReplying ? "message-input-container" : "none"}>
        <div
          id={toolbarId} // Use the unique toolbar ID
          style={{
            width: "100%",
            border: "none",
            background: "white",
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <button className="ql-bold"></button>
          <button className="ql-underline"></button>
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-list" value="bullet"></button>
        </div>
      </IonFooter>
    </div>
  );
};

export default Editor;