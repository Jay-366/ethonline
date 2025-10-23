// Comprehensive Buffer polyfill for browser environment
import { Buffer } from 'buffer';

// Extend Buffer prototype with missing methods
if (typeof Buffer !== 'undefined') {
  // Add writeUint32BE if it doesn't exist
  if (!Buffer.prototype.writeUint32BE) {
    Buffer.prototype.writeUint32BE = function(value: number, offset: number = 0) {
      return this.writeUInt32BE(value, offset);
    };
  }

  // Add other potentially missing methods
  if (!Buffer.prototype.readUint32BE) {
    Buffer.prototype.readUint32BE = function(offset: number = 0) {
      return this.readUInt32BE(offset);
    };
  }

  if (!Buffer.prototype.writeUint32LE) {
    Buffer.prototype.writeUint32LE = function(value: number, offset: number = 0) {
      return this.writeUInt32LE(value, offset);
    };
  }

  if (!Buffer.prototype.readUint32LE) {
    Buffer.prototype.readUint32LE = function(offset: number = 0) {
      return this.readUInt32LE(offset);
    };
  }
}

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).global = globalThis;
}

// Also make available in global scope
if (typeof global !== 'undefined') {
  (global as any).Buffer = Buffer;
}

export { Buffer };
