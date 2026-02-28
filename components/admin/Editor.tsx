"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Undo,
    Image as ImageIcon,
    Link as LinkIcon,
    Heading1,
    Heading2
} from "lucide-react";
import { useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuButton = ({
    onClick,
    isActive = false,
    children,
    disabled = false
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    disabled?: boolean;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-md transition-colors ${isActive
                ? "bg-indigo-100 text-indigo-600"
                : "hover:bg-gray-100 text-gray-600"
            } disabled:opacity-50`}
    >
        {children}
    </button>
);

export default function Editor({ content, onChange }: EditorProps) {
    const supabase = createClient();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto",
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-indigo-600 underline",
                },
            }),
            Placeholder.configure({
                placeholder: "İçeriği buraya yazın...",
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[400px] p-4",
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith("image/")) {
                        uploadImage(file);
                        return true;
                    }
                }
                return false;
            },
        },
    });

    const uploadImage = useCallback(async (file: File) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError, data } = await supabase.storage
                .from("blog_images")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from("blog_images")
                .getPublicUrl(filePath);

            editor?.chain().focus().setImage({ src: publicUrl }).run();
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Resim yüklenirken bir hata oluştu.");
        }
    }, [editor, supabase]);

    const addImage = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                await uploadImage(file);
            }
        };
        input.click();
    };

    const setLink = () => {
        const url = window.prompt("URL girin:");
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                >
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                >
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                >
                    <Heading1 className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                >
                    <Heading2 className="w-4 h-4" />
                </MenuButton>
                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                >
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                >
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                >
                    <Quote className="w-4 h-4" />
                </MenuButton>
                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                <MenuButton onClick={setLink} isActive={editor.isActive("link")}>
                    <LinkIcon className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={addImage}>
                    <ImageIcon className="w-4 h-4" />
                </MenuButton>
                <div className="flex-grow" />
                <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                    <Undo className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                    <Redo className="w-4 h-4" />
                </MenuButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
