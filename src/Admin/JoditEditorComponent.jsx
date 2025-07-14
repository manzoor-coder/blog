import React, { useRef, useCallback, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import 'jodit/es2021/jodit.min.css';


const JoditEditorComponent = ({ value, onChange, onImageSelect }) => {
  const editor = useRef(null);
  const fileInputRef = useRef(null);

  // Log editor initialization
  useEffect(() => {
    console.log('Editor ref:', editor.current);
    if (editor.current) {
      console.log('Editor instance:', editor.current.jodit || editor.current.editor || 'Not available');
    }
  }, []);

  // 📂 Handle image selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Generate local URL for preview
    const localUrl = URL.createObjectURL(file);
    console.log('Local image URL:', localUrl); // Debug

    // Pass the file to the parent component
    onImageSelect(file);

    // Prepare image HTML
    const imageHtml = `<p><img src="${localUrl}" alt="uploaded" style="max-width:100%; height: 500px; object-fit:cover; margin: 10px 0;" /></p>`;
    console.log('Inserting image HTML:', imageHtml); // Debug

    // Update editor content
    if (editor.current) {
      try {
        // Try Jodit's insertHTML method
        if (editor.current.jodit) {
          editor.current.jodit.s.insertHTML(imageHtml);
        } else if (editor.current.editor) {
          editor.current.editor.execCommand('insertHTML', false, imageHtml);
        } else {
          // Fallback to updating value directly
          const newContent = (value || '') + imageHtml;
          console.log('Editor not fully initialized, using fallback content:', newContent); // Debug
          onChange(newContent);
        }
        console.log('Editor content after insertion:', editor.current.value); // Debug
        onChange(editor.current.value || value); // Update parent state
      } catch (error) {
        console.error('❌ Error inserting image into editor:', error);
        // Fallback: Append to current content
        const newContent = (value || '') + imageHtml;
        console.log('Fallback content:', newContent); // Debug
        onChange(newContent);
        alert('Image inserted using fallback method.');
      }
    } else {
      console.error('❌ Editor ref not ready');
      // Fallback: Update parent state directly
      const newContent = (value || '') + imageHtml;
      console.log('Fallback content (no editor):', newContent); // Debug
      onChange(newContent);
      alert('Editor not ready, image added to content.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  // 🧠 Handle toolbar image button click
  const handleImageButtonClick = useCallback(() => {
    console.log('fileInputRef:', fileInputRef.current); // Debug
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('❌ File input not found');
    }
  }, []);

  // ⚙️ Editor configuration
  const config = {
    readonly: false,
    height: 300,
    toolbarAdaptive: false,
    uploader: {
      insertImageAsBase64URI: false,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
      url: '', // Disable default uploader
    },
    buttons: [
      
      'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', '|',
      'paragraph', 'font', 'fontsize', '|',
      'brush', 'cut', 'copy', 'paste', '|',
      'ul', 'ol', 'outdent', 'indent', '|',
      'left', 'center', 'right', 'justify', '|',
      'link', 'unlink', 'video', 'table', '|',
      'hr', 'print', '|',
      'undo', 'redo', 'eraser', 'fullsize','source', '|',
    ],

    extraButtons: [
      {
        name: 'customImage',
        icon: 'image',
        exec: () => {
          console.log('Custom image button clicked!'); // Debug
          handleImageButtonClick();
        },
      },
    ],
    cleanHTML: {
      removeEmptyElements: false,
      fillEmptyParagraph: false,
    },
  };

  return (
    <div className="bg-white border p-3 rounded">
      <input
        type="file"
        accept="image/*"
        id="hidden-file-input"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <JoditEditor
        ref={editor}
        value={value}
        tabIndex={1}
        onBlur={(newContent) => {
          console.log('Editor blurred, new content:', newContent); // Debug
          onChange(newContent);
        }}
        onChange={() => { }}
        config={config}
      />
    </div>
  );
};

export default JoditEditorComponent;