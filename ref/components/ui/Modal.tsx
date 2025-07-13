import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
type ScrollBehavior = 'inside' | 'outside';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  isCentered?: boolean;
  scrollBehavior?: ScrollBehavior;
  className?: string;
  overlayClassName?: string;
}

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Modal - 模态框组件
 * 
 * 用于显示需要用户注意或交互的内容的覆盖层。
 * 
 * @component
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Button onClick={() => setIsOpen(true)}>打开模态框</Button>
 * 
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <Modal.Header>模态框标题</Modal.Header>
 *   <Modal.Body>模态框内容</Modal.Body>
 *   <Modal.Footer>
 *     <Button variant="ghost" onClick={() => setIsOpen(false)}>取消</Button>
 *     <Button>确认</Button>
 *   </Modal.Footer>
 * </Modal>
 * ```
 */
const Modal: React.FC<ModalProps> & {
  Header: React.FC<ModalHeaderProps>;
  Body: React.FC<ModalBodyProps>;
  Footer: React.FC<ModalFooterProps>;
} = ({
  children,
  isOpen = false,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  isCentered = true,
  scrollBehavior = 'inside',
  className = '',
  overlayClassName = '',
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 尺寸样式映射
  const sizeClasses: Record<ModalSize, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };
  
  // 滚动行为样式
  const scrollClasses = scrollBehavior === 'inside' 
    ? 'overflow-hidden' 
    : '';
  
  // 垂直对齐样式
  const alignmentClasses = isCentered 
    ? 'items-center' 
    : 'items-start mt-16';
  
  // 基础样式
  const baseClasses = 'relative bg-white rounded-md shadow-xl';
  
  // 组合模态框样式
  const modalClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${scrollClasses} 
    w-full mx-auto 
    ${className}
  `;
  
  // 组合遮罩层样式
  const overlayBaseClasses = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50 p-4';
  const overlayClasses = `
    ${overlayBaseClasses} 
    ${alignmentClasses} 
    ${overlayClassName}
  `;
  
  // 处理遮罩层点击
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };
  
  // 处理ESC键按下
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose?.();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // 恢复背景滚动
    };
  }, [isOpen, closeOnEsc, onClose]);
  
  // 聚焦到模态框
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);
  
  // 如果模态框未打开，不渲染任何内容
  if (!isOpen) return null;
  
  // 使用Portal将模态框渲染到body下
  return createPortal(
    <div 
      className={overlayClasses} 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={modalRef}
        className={modalClasses}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

/**
 * Modal.Header - 模态框头部组件
 */
const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  children, 
  onClose, 
  showCloseButton = true,
  className = '', 
  ...props 
}) => {
  const baseClasses = 'px-6 py-4 border-b border-gray-200 flex items-center justify-between';
  
  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      <h3 className="text-lg font-medium text-gray-900">
        {children}
      </h3>
      {showCloseButton && onClose && (
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={onClose}
          aria-label="关闭"
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

/**
 * Modal.Body - 模态框内容组件
 */
const ModalBody: React.FC<ModalBodyProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'px-6 py-4';
  
  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Modal.Footer - 模态框底部组件
 */
const ModalFooter: React.FC<ModalFooterProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'px-6 py-4 border-t border-gray-200 flex justify-end space-x-2';
  
  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

// 组合组件
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal; 