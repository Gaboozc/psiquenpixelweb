'use client';

import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { marked } from 'marked';

// --- helpers ---------------------------------------------------------------
const marginFor = (align) =>
  align === 'left' ? '0 auto 0 0' : align === 'right' ? '0 0 0 auto' : '0 auto';

// Accept content that is either HTML (new posts) or Markdown (legacy) and give
// TipTap HTML to edit.
function toEditorHTML(content) {
  if (!content) return '';
  if (/<(p|h[1-6]|ul|ol|blockquote|img|video|pre|figure|div)\b/i.test(content)) return content;
  try {
    return marked.parse(content);
  } catch {
    return content;
  }
}

// --- custom nodes with width + align, round-tripped via data-align ----------
const AlignAttrs = {
  width: {
    default: '100%',
    parseHTML: (el) => el.style?.width || el.getAttribute('width') || '100%',
  },
  align: {
    default: 'center',
    parseHTML: (el) => el.getAttribute('data-align') || 'center',
  },
};

const CustomImage = Image.extend({
  addAttributes() {
    return { ...this.parent?.(), ...AlignAttrs };
  },
  renderHTML({ HTMLAttributes }) {
    const { width, align, style, ...rest } = HTMLAttributes;
    return [
      'img',
      mergeAttributes(rest, {
        'data-align': align,
        style: `display:block;width:${width};margin:${marginFor(align)};`,
      }),
    ];
  },
});

const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null }, ...AlignAttrs };
  },
  parseHTML() {
    return [{ tag: 'video' }];
  },
  renderHTML({ HTMLAttributes }) {
    const { src, width, align } = HTMLAttributes;
    return [
      'video',
      {
        src,
        controls: 'true',
        playsinline: 'true',
        'data-align': align,
        style: `display:block;width:${width};margin:${marginFor(align)};`,
      },
    ];
  },
  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: options }),
    };
  },
});

// --- toolbar ---------------------------------------------------------------
function Btn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`text-[11px] font-body px-2 py-1 border transition-colors disabled:opacity-40 ${
        active
          ? 'border-brand-purple text-brand-purple bg-brand-purple/10'
          : 'border-brand-border text-brand-muted hover:border-brand-purple hover:text-brand-purple'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }) {
  const imgInput = useRef(null);
  const vidInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      CustomImage.configure({ inline: false }),
      Video,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: toEditorHTML(value),
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none font-body focus:outline-none min-h-[320px] px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return <div className="pixel-border p-4 text-brand-muted text-sm font-body">Cargando editor…</div>;
  }

  const uploadAndInsert = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || 'Error al subir');
      } else if (data.kind === 'video') {
        editor.chain().focus().setVideo({ src: data.url, width: '100%', align: 'center' }).run();
      } else {
        editor.chain().focus().setImage({ src: data.url, width: '100%', align: 'center' }).run();
      }
    } catch {
      setError('Error de red al subir');
    }
    setUploading(false);
  };

  const mediaSelected = editor.isActive('image') || editor.isActive('video');
  const setMediaAttr = (attr, val) => {
    const type = editor.isActive('image') ? 'image' : 'video';
    editor.chain().focus().updateAttributes(type, { [attr]: val }).run();
  };

  const addLink = () => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('URL del enlace (vacío para quitar):', prev);
    if (url === null) return;
    if (url === '') editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  };

  const sep = <span className="w-px h-5 bg-brand-border mx-0.5" />;

  return (
    <div className="pixel-border" style={{ backgroundColor: 'var(--color-brand-bg, #0d0d0f)' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-brand-border">
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Deshacer">↶</Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Rehacer">↷</Btn>
        {sep}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título">H2</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Subtítulo">H3</Btn>
        <Btn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Párrafo">¶</Btn>
        {sep}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrita"><b>B</b></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursiva"><i>I</i></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Subrayado"><u>U</u></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado"><s>S</s></Btn>
        {sep}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">•</Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">1.</Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Cita">❝</Btn>
        <Btn onClick={addLink} active={editor.isActive('link')} title="Enlace">🔗</Btn>
        {sep}
        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Alinear izquierda">⇤</Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centrar">↔</Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Alinear derecha">⇥</Btn>
        {sep}
        <Btn onClick={() => imgInput.current?.click()} disabled={uploading} title="Insertar imagen/GIF">🖼</Btn>
        <Btn onClick={() => vidInput.current?.click()} disabled={uploading} title="Insertar vídeo">🎬</Btn>
        {uploading && <span className="text-brand-muted text-[10px] font-body ml-1">subiendo…</span>}
        {error && <span className="text-red-400 text-[10px] font-body ml-1">{error}</span>}
      </div>

      {/* Contextual media controls */}
      {mediaSelected && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-brand-border bg-brand-purple/5">
          <span className="text-brand-muted text-[10px] font-body mr-1" style={{ fontFamily: 'var(--font-pixel)' }}>MEDIO:</span>
          <span className="text-brand-muted text-[10px] font-body">tamaño</span>
          {['25%', '50%', '75%', '100%'].map((w) => (
            <Btn key={w} onClick={() => setMediaAttr('width', w)} title={`Ancho ${w}`}>{w}</Btn>
          ))}
          <span className="text-brand-muted text-[10px] font-body ml-2">posición</span>
          <Btn onClick={() => setMediaAttr('align', 'left')} title="Izquierda">⇤</Btn>
          <Btn onClick={() => setMediaAttr('align', 'center')} title="Centro">↔</Btn>
          <Btn onClick={() => setMediaAttr('align', 'right')} title="Derecha">⇥</Btn>
        </div>
      )}

      <EditorContent editor={editor} />
      {placeholder && editor.isEmpty && (
        <p className="px-4 pb-3 -mt-2 text-brand-border text-xs font-body pointer-events-none">{placeholder}</p>
      )}

      <input ref={imgInput} type="file" accept="image/*" onChange={uploadAndInsert} className="hidden" />
      <input ref={vidInput} type="file" accept="video/*" onChange={uploadAndInsert} className="hidden" />
    </div>
  );
}
