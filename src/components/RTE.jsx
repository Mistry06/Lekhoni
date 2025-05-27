import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({ name, control, label, defaultValue = "" }) { // Removed apiKey from props as it's hardcoded
    return (
        <div className="w-full">
            {label && <label className="inline-block mb-1 pl-1 text-white">{label}</label>} {/* Added text-white for visibility */}

            <Controller
                name={name || "content"}
                control={control}
                defaultValue={defaultValue} // This defaultValue is for the Controller
                render={({ field: { onChange, value } }) => (
                    <Editor
                        apiKey="9230e9254j3dlrw39ezodnrxlm82ztegtgnb45xp6bgupk60" // ⭐ CRITICAL FIX: Replace with your actual, valid TinyMCE API key ⭐
                        // Example valid key: "no-api-key" for development (with watermark) or your actual cloud key
                        value={value} // This value comes from react-hook-form's field state
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [ // ⭐ BEST PRACTICE: Use array for plugins ⭐
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'help', 'wordcount'
                            ],
                            toolbar:
                                "undo redo | blocks | image | bold italic forecolor | " +
                                "alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | removeformat | help",
                            content_style: `
                                body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color: #fff; }
                                .mce-content-body { background-color: #333; } /* Example: Dark background for editor content */
                            `,
                            skin: "oxide-dark", // ⭐ OPTIONAL: Use a dark skin for consistency with your theme ⭐
                            content_css: "dark", // ⭐ OPTIONAL: Dark content CSS ⭐
                            // More options for dark theme integration:
                            // https://www.tiny.cloud/docs/tinymce/6/dark-mode/
                        }}
                        onEditorChange={onChange} // Update react-hook-form state on editor change
                    />
                )}
            />
        </div>
    );
}