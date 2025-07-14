import React, { useRef, useCallback, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';

const QuillEditorComponent = ({ value, onChange, onImageSelect, editorRef }) => {
  const fileInputRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [remountKey, setRemountKey] = useState(0); // For forcing remount

  // Initialize Quill editor
  useEffect(() => {
    let timeoutId;
    let observer;
    let pollInterval;

    const checkEditorReady = () => {
      try {
        if (editorRef.current && editorRef.current.getEditor()) {
          console.log('Quill editor initialized:', editorRef.current);
          setIsEditorReady(true);
        } else {
          console.log('Quill editor not ready yet:', {
            editorRef: editorRef.current,
            hasEditor: !!editorRef.current?.getEditor(),
          });
        }
      } catch (error) {
        console.error('❌ Error checking Quill editor initialization:', error);
      }
    };

    // Delay initial check to allow Quill to load
    setTimeout(checkEditorReady, 500);

    // Poll for readiness
    pollInterval = setInterval(checkEditorReady, 250);

    // Observe DOM for Quill editor
    const observeEditor = () => {
      const editorElement = document.querySelector('.ql-editor');
      if (editorElement) {
        console.log('Quill editor DOM detected');
        checkEditorReady();
      }
    };

    observer = new MutationObserver(observeEditor);
    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback timeout
    timeoutId = setTimeout(() => {
      if (!isEditorReady) {
        console.warn('Quill editor initialization timeout after 15 seconds');
        checkEditorReady();
        if (!isEditorReady) {
          toast.error('Editor failed to initialize. Reloading editor...');
          setRemountKey((prev) => prev + 1); // Force remount
        }
      }
    }, 15000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [editorRef, isEditorReady, remountKey]);

  // Handle image insertion
  const insertImage = (file) => {
    if (!isEditorReady || !editorRef.current) {
      console.error('❌ Quill editor not ready for image insertion');
      toast.error('Editor is not ready. Please try again.');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    console.log('Local image URL:', localUrl); // Debug

    // Pass the file to the parent component
    onImageSelect(file);

    try {
      const quill = editorRef.current.getEditor();
      const range = quill.getSelection(true); // Get cursor position
      quill.insertEmbed(range.index, 'image', localUrl);
      quill.setSelection(range.index + 1); // Move cursor after image
      console.log('Quill content after insertion:', quill.root.innerHTML); // Debug
      onChange(quill.root.innerHTML); // Update parent state
    } catch (error) {
      console.error('❌ Error inserting image into Quill editor:', error);
      toast.error('Failed to insert image at cursor position. Please try again.');
    }
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isEditorReady) {
      console.log('Quill editor not ready, please wait'); // Debug
      toast.warn('Editor is loading. Please try again.');
      return;
    }

    insertImage(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  // Handle custom image button click
  const handleImageButtonClick = useCallback(() => {
    console.log('Custom image button clicked!'); // Debug
    if (!isEditorReady) {
      console.log('Quill editor not ready'); // Debug
      toast.warn('Editor is loading. Please try again.');
      return;
    }
    if (fileInputRef.current) {
      if (editorRef.current) {
        try {
          editorRef.current.getEditor().focus();
        } catch (error) {
          console.error('❌ Error focusing Quill editor:', error);
        }
      }
      fileInputRef.current.click();
    } else {
      console.error('❌ File input not found');
      toast.error('File input not found. Please try again.');
    }
  }, [isEditorReady]);

  // Quill modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'video', 'image'],
        ['clean'],
        [{ 'customImage': 'image' }], // Custom image button
      ],
      handlers: {
        'customImage': handleImageButtonClick,
      },
    },
  };

  return (
    <div key={remountKey} className="bg-white border p-3 rounded">
      <input
        type="file"
        accept="image/*"
        id="hidden-file-input"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <ReactQuill
        ref={editorRef}
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
        placeholder="Write your content here..."
      />
    </div>
  );
};

export default QuillEditorComponent;