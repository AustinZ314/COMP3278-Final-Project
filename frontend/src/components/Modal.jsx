import { useEffect, useRef } from 'react'

export default function Modal({ title, onClose, children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  return <dialog ref={ref} className={`app-dialog ${className}`} aria-label={title} onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="dialog-heading"><h2>{title}</h2><button type="button" className="icon-close" onClick={onClose} aria-label={`Close ${title}`}>×</button></div>
    {children}
  </dialog>
}
