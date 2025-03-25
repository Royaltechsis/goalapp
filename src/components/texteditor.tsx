// import React from 'react';
import { Editor, RichUtils, EditorState } from 'draft-js';
import { 
  Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered 
} from 'lucide-react';
import "draft-js/dist/Draft.css";

interface TextEditorProps {
  editorState: EditorState;
  onDescriptionChange: (state: EditorState) => void;
}

const TextEditor = ({ editorState, onDescriptionChange }: TextEditorProps) => {
  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onDescriptionChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleBlockType = (blockType: string) => {
    onDescriptionChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (style: string) => {
    onDescriptionChange(RichUtils.toggleInlineStyle(editorState, style));
  };

//   const handleLink = () => {
//     const url = window.prompt('Enter URL:');
//     if (url) {
//       const contentState = editorState.getCurrentContent();
//       const contentStateWithEntity = contentState.createEntity(
//         'LINK',
//         'MUTABLE',
//         { url }
//       );
//       const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
//       onDescriptionChange(RichUtils.toggleLink(
//         editorState,
//         editorState.getSelection(),
//         entityKey
//       ));
//     }
//   };

  const getBlockStyle = (block: any) => {
    switch (block.getType()) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white  p-2">
      <div className="flex flex-wrap gap-2 border-b pb-2 mb-2">
        {/* Inline Styles */}
        <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleInlineStyle('BOLD')}
          className={`p-1 rounded flex items-center ${
            editorState.getCurrentInlineStyle().has('BOLD') 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleInlineStyle('ITALIC')}
          className={`p-1 rounded flex items-center ${
            editorState.getCurrentInlineStyle().has('ITALIC') 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleInlineStyle('UNDERLINE')}
          className={`p-1 rounded flex items-center ${
            editorState.getCurrentInlineStyle().has('UNDERLINE') 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </button>

        <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleInlineStyle('STRIKETHROUGH')}
          className={`p-1 rounded flex items-center ${
            editorState.getCurrentInlineStyle().has('STRIKETHROUGH') 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        {/* Block Styles */}
        <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleBlockType('unordered-list-item')}
          className={`p-1 rounded flex items-center ${
            editorState.getBlockTree(editorState.getSelection().getStartKey()).get(0).get('type') === 'unordered-list-item' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleBlockType('ordered-list-item')}
          className={`p-1 rounded flex items-center ${
            editorState.getBlockTree(editorState.getSelection().getStartKey()).get(0).get('type') === 'ordered-list-item' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        {/* <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleBlockType('header-one')}
          className={`p-1 rounded flex items-center ${
            editorState.getBlockTree(editorState.getSelection().getStartKey()).get(0).get('type') === 'header-one' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button> */}

        {/* Alignment */}
        {/* <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleBlockType('left')}
          className={`p-1 rounded flex items-center ${
            getBlockStyle(editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey())) === 'text-left' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button> */}

        {/* <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleBlockType('center')}
          className={`p-1 rounded flex items-center ${
            getBlockStyle(editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey())) === 'text-center' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button> */}

        {/* <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleBlockType('right')}
          className={`p-1 rounded flex items-center ${
            getBlockStyle(editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey())) === 'text-right' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button> */}

        {/* Link */}
        {/* <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
          className="p-1 rounded flex items-center hover:bg-gray-100"
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button> */}

        {/* Undo/Redo */}
        {/* <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onDescriptionChange(EditorState.undo(editorState))}
          className="p-1 rounded flex items-center hover:bg-gray-100 ml-auto"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </button>

        <button 
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onDescriptionChange(EditorState.redo(editorState))}
          className="p-1 rounded flex items-center hover:bg-gray-100"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </button> */}
      </div>

      <Editor
        editorState={editorState}
        onChange={onDescriptionChange}
        handleKeyCommand={handleKeyCommand}
        blockStyleFn={getBlockStyle}
        placeholder="Describe your goal..."
      />
    </div>
  );
};

export default TextEditor;