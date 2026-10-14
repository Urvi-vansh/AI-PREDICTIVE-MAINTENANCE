import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'default',
  maxWidth,
  style,
  headerActions
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isFullscreen = size === 'fullscreen' || size === 'full';
  const isXLarge = size === 'xl';
  const isLarge = size === 'lg' || size === 'large';

  const sizeClass = isFullscreen
    ? 'modal-fullscreen'
    : isXLarge
    ? 'modal-xl'
    : isLarge
    ? 'modal-lg'
    : '';

  return (
    <div className={`modal-overlay ${isFullscreen ? 'modal-overlay-fullscreen' : ''}`} onClick={onClose}>
      <div
        className={`modal-content ${sizeClass}`}
        style={{
          ...(maxWidth ? { maxWidth } : {}),
          ...style
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            {headerActions}
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};
