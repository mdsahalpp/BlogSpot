import { useState, useRef } from "react";
import "./textarea.css";

const Textarea = ({ value, onChange }) => {
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const textarea = textareaRef.current;

    textarea.style.height = "auto";

    textarea.style.height = textarea.scrollHeight + "px";

    onChange(e);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      placeholder="Add a comment..."
      className="auto-grow-textarea"
    />
  );
};
export default Textarea;
