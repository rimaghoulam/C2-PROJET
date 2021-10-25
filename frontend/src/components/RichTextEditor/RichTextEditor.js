import React, { useMemo } from 'react';
import JoditEditor from "jodit-react";


//readOnly className style  placeholder  name
//  value   onChange  error  language('en', 'ar')
const RichTextEditor = (props) => {

    const val = useMemo(() => props.value, [props.value])

    const config = {
        readonly: props.readOnly,
        placeholder: props.placeholder || "please enter the text",
        required: true,
        uploader: {
            insertImageAsBase64URI: true
        },
        toolbarButtonSize: 'middle',
        theme: 'default',
        enableDragAndDropFileToEditor: true,
        // spellcheck: true,
        language: props.language || 'en',
        imageDefaultWidth: 200,
        direction: props.language === 'ar' ? 'rtl' : 'ltr',
        // removeButtons: ['dots', 'eraser', 'undo', 'redo', 'fullsize', 'about', 'outdent', 'indent', 'video', 'print', 'copyformat', 'table', 'fontsize', 'superscript', 'subscript', 'file', 'cut', 'selectall'],
    }

    const handleChange = (e) => {
        if (props.error) props.onChange(e)
    }

    return (

        <div style={{ border: props.error ? '1px solid red' : 'none', ...props.style }} className={props.className || ''}>
            <JoditEditor
                value={val}
                config={config}
                onChange={handleChange}
                onBlur={e => (e === '<p><br></p>' || e.trim().length === 0) ? props.onChange('') : props.onChange(e)}
                onFocus={props.onChange}
            />
        </div>
    );
}


export default RichTextEditor