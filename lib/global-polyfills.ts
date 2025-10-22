// Global polyfills that must run before any other code
import { Buffer } from 'buffer';
import util from 'util';
import inherits from 'inherits';

// Make Buffer available globally immediately
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).global = globalThis;
}

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
}

if (typeof global !== 'undefined') {
  (global as any).Buffer = Buffer;
}

// Extend Buffer prototype with missing methods
// Some third-party SDKs expect Node-style `Buffer` helpers; ensure graceful fallback aliases exist.
const installBufferMethodFallbacks = () => {
  if (!Buffer || !Buffer.prototype) {
    return;
  }

  const proto = Buffer.prototype as BufferPrototypePolyfilled;

  if (!proto.writeUint32BE && proto.writeUInt32BE) {
    proto.writeUint32BE = function(value: number, offset: number = 0) {
      return proto.writeUInt32BE!.call(this, value, offset);
    };
  }

  if (!proto.readUint32BE && proto.readUInt32BE) {
    proto.readUint32BE = function(offset: number = 0) {
      return proto.readUInt32BE!.call(this, offset);
    };
  }

  if (!proto.writeUint32LE && proto.writeUInt32LE) {
    proto.writeUint32LE = function(value: number, offset: number = 0) {
      return proto.writeUInt32LE!.call(this, value, offset);
    };
  }

  if (!proto.readUint32LE && proto.readUInt32LE) {
    proto.readUint32LE = function(offset: number = 0) {
      return proto.readUInt32LE!.call(this, offset);
    };
  }

  if (!proto.writeUint16BE && proto.writeUInt16BE) {
    proto.writeUint16BE = function(value: number, offset: number = 0) {
      return proto.writeUInt16BE!.call(this, value, offset);
    };
  }

  if (!proto.readUint16BE && proto.readUInt16BE) {
    proto.readUint16BE = function(offset: number = 0) {
      return proto.readUInt16BE!.call(this, offset);
    };
  }

  if (!proto.writeUint8 && proto.writeUInt8) {
    proto.writeUint8 = function(value: number, offset: number = 0) {
      return proto.writeUInt8!.call(this, value, offset);
    };
  }

  if (!proto.readUint8 && proto.readUInt8) {
    proto.readUint8 = function(offset: number = 0) {
      return proto.readUInt8!.call(this, offset);
    };
  }
};

// Arcana's SDK may instantiate plain Uint8Array objects, so mirror the helpers there as well.
const installUint8ArrayFallbacks = () => {
  const proto = Uint8Array.prototype as Uint8ArrayPrototypePolyfilled;

  if (!proto.writeUint32BE) {
    proto.writeUint32BE = function(value: number, offset: number = 0) {
      const view = new DataView(this.buffer, this.byteOffset, this.byteLength);
      view.setUint32(offset, value);
      return offset + 4;
    };
  }

  if (!proto.readUint32BE) {
    proto.readUint32BE = function(offset: number = 0) {
      const view = new DataView(this.buffer, this.byteOffset, this.byteLength);
      return view.getUint32(offset);
    };
  }
};

installBufferMethodFallbacks();
installUint8ArrayFallbacks();

const installUtilFallbacks = () => {
  const utilRef = util as UtilPolyfill;

  if (typeof utilRef.inherits !== 'function') {
    utilRef.inherits = function(ctor: unknown, superCtor: unknown) {
      return (inherits as UtilInherits)(ctor as UtilConstructor, superCtor as UtilConstructor);
    };
  }

  if (typeof globalThis !== 'undefined') {
    (globalThis as any).util = utilRef;
  }

  if (typeof window !== 'undefined') {
    (window as any).util = utilRef;
  }
};

installUtilFallbacks();

// Also set up process polyfill
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = require('process/browser');
}

export {};

type BufferPrototypePolyfilled = Buffer & {
  writeUInt32BE?: (value: number, offset?: number) => number;
  writeUInt32LE?: (value: number, offset?: number) => number;
  writeUInt16BE?: (value: number, offset?: number) => number;
  writeUInt8?: (value: number, offset?: number) => number;
  readUInt32BE?: (offset?: number) => number;
  readUInt32LE?: (offset?: number) => number;
  readUInt16BE?: (offset?: number) => number;
  readUInt8?: (offset?: number) => number;
  writeUint32BE?: (value: number, offset?: number) => number;
  writeUint32LE?: (value: number, offset?: number) => number;
  writeUint16BE?: (value: number, offset?: number) => number;
  writeUint8?: (value: number, offset?: number) => number;
  readUint32BE?: (offset?: number) => number;
  readUint32LE?: (offset?: number) => number;
  readUint16BE?: (offset?: number) => number;
  readUint8?: (offset?: number) => number;
};

type Uint8ArrayPrototypePolyfilled = Uint8Array & {
  writeUint32BE?: (value: number, offset?: number) => number;
  readUint32BE?: (offset?: number) => number;
};

type UtilConstructor = new (...args: any[]) => any;
type UtilInherits = (ctor: UtilConstructor, superCtor: UtilConstructor) => void;
type UtilPolyfill = typeof util & {
  inherits?: UtilInherits;
};
