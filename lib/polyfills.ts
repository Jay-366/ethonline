// Polyfills for Node.js modules in browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
  (window as any).process = require('process/browser');
  
  // Ensure Buffer methods are available
  if (!Buffer.prototype.writeUint32BE) {
    Buffer.prototype.writeUint32BE = function(value: number, offset: number = 0) {
      this.writeUInt32BE(value, offset);
    };
  }
}

// Also make available in global scope for Node.js compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).global = globalThis;
}

export {};
