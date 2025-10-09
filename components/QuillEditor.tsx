'use client'

import { useEffect, useRef, useState } from 'react'
import '../styles/quill.css'

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  hasError?: boolean
}

type QuillInstance = {
  root: { innerHTML: string };
  on: (event: string, handler: () => void) => void;
};

export default function QuillEditor({
  value,
  onChange,
  placeholder = '',
  className = '',
  hasError = false,
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<QuillInstance | null>(null)
  const initialized = useRef(false) // 👈 tambahan flag
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadQuill = async () => {
      if (
        typeof window !== 'undefined' &&
        editorRef.current &&
        !initialized.current
      ) {
        initialized.current = true // 👈 tandai sudah diinisialisasi

        const { default: Quill } = await import('quill')
        await import('quill/dist/quill.snow.css')

        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          placeholder,
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link'],
              ['clean'],
            ],
          },
        })

        quillRef.current.on('text-change', () => {
          const html = quillRef.current?.root.innerHTML || ''
          onChange(html)
        })

        setIsLoaded(true)
      }
    }

    loadQuill()
  }, [onChange, placeholder])

  useEffect(() => {
    if (quillRef.current && isLoaded && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value
    }
  }, [value, isLoaded])

  return (
    <div className={`${className} ${hasError ? 'quill-error' : ''}`}>
      <div ref={editorRef} />
    </div>
  )
}
