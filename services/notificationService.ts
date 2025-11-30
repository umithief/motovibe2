
// @ts-ignore
import { Notyf } from 'notyf';

// Global configuration for Notyf
const notyf = new Notyf({
  duration: 4000,
  position: { x: 'center', y: 'top' }, // Center Top positioning
  ripple: true,
  dismissible: true,
  types: [
    {
      type: 'success',
      background: 'transparent', // Let CSS handle gradients
      className: 'notyf-success',
      icon: {
        className: 'notyf__icon--success',
        tagName: 'i',
        color: 'white'
      }
    },
    {
      type: 'error',
      background: 'transparent',
      className: 'notyf-error',
      icon: {
        className: 'notyf__icon--error',
        tagName: 'i',
        color: 'white'
      }
    },
    {
      type: 'info',
      background: 'transparent',
      className: 'notyf-info',
      icon: false // Custom handling via CSS or default
    }
  ]
});

// Wrapper object to keep usage clean
export const notify = {
  success: (message: string) => notyf.success({ message }),
  error: (message: string) => notyf.error({ message }),
  info: (message: string) => notyf.open({ type: 'info', message })
};
