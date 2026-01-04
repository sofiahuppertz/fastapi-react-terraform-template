// Simple toast notification utility
import { palettes } from '../config/colors';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

class ToastManager {
  private container: HTMLDivElement | null = null;

  private getContainer(): HTMLDivElement {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  show({ message, type = 'info', duration = 5000 }: ToastOptions): void {
    const container = this.getContainer();
    const toast = document.createElement('div');
    
    const colors = {
      success: { 
        bg: palettes.success.success2 + '60', // 90% opacity
        border: palettes.success.success3, 
        text: '#ffffff' 
      },
      error: { 
        bg: palettes.danger.danger2 + '60', // 90% opacity
        border: palettes.danger.danger3, 
        text: '#ffffff' 
      },
      warning: { 
        bg: palettes.warning.warning2 + '60', // 90% opacity
        border: palettes.warning.warning3, 
        text: '#ffffff' 
      },
      info: { 
        bg: palettes.sky.sky2 + '60', // 90% opacity
        border: palettes.sky.sky3, 
        text: '#ffffff' 
      },
    };

    const color = colors[type];

    toast.style.cssText = `
      background-color: ${color.bg};
      color: ${color.text};
      border-left: 4px solid ${color.border};
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      font-family: 'Courier New', monospace;
      font-size: 14px;
      max-width: 400px;
      word-wrap: break-word;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      opacity: 1;
      transition: opacity 0.3s ease-out;
    `;

    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    if (!document.getElementById('toast-animations')) {
      style.id = 'toast-animations';
      document.head.appendChild(style);
    }

    toast.textContent = message;
    container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (toast.parentNode) {
          container.removeChild(toast);
        }
        // Clean up container if empty
        if (container.children.length === 0 && container.parentNode) {
          document.body.removeChild(container);
          this.container = null;
        }
      }, 300);
    }, duration);
  }

  success(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number): void {
    this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration?: number): void {
    this.show({ message, type: 'info', duration });
  }
}

export const toast = new ToastManager();

