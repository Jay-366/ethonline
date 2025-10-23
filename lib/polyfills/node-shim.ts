'use client';

import { Buffer } from 'buffer';
import process from 'process';

type ConstructorLike = {
  new (...args: unknown[]): unknown;
  prototype: object;
  [key: string]: unknown;
};

type GlobalWithShims = typeof globalThis & {
  Buffer?: typeof Buffer;
  process?: typeof process;
  global?: typeof globalThis;
  util?: {
    inherits?: (ctor: ConstructorLike, superCtor: ConstructorLike) => void;
  };
};

const globalScope = globalThis as GlobalWithShims;

if (!globalScope.global) {
  globalScope.global = globalScope;
}

if (!globalScope.Buffer) {
  globalScope.Buffer = Buffer;
}

const bufferProto = globalScope.Buffer?.prototype as Record<string, unknown> | undefined;

if (bufferProto) {
  const aliasPairs: Array<[string, string]> = [
    ['writeUint8', 'writeUInt8'],
    ['writeUint16LE', 'writeUInt16LE'],
    ['writeUint16BE', 'writeUInt16BE'],
    ['writeUint32LE', 'writeUInt32LE'],
    ['writeUint32BE', 'writeUInt32BE'],
    ['readUint8', 'readUInt8'],
    ['readUint16LE', 'readUInt16LE'],
    ['readUint16BE', 'readUInt16BE'],
    ['readUint32LE', 'readUInt32LE'],
    ['readUint32BE', 'readUInt32BE'],
  ];

  for (const [alias, canonical] of aliasPairs) {
    if (typeof bufferProto[alias] !== 'function' && typeof bufferProto[canonical] === 'function') {
      bufferProto[alias] = bufferProto[canonical];
    }
  }
}

if (!globalScope.process) {
  globalScope.process = process;
} else if (!globalScope.process.env) {
  globalScope.process.env = process.env ?? {};
}

if (typeof globalScope.process?.browser === 'undefined') {
  (globalScope.process as typeof process & { browser?: boolean }).browser = true;
}

const ensureInherits = (ctor: ConstructorLike, superCtor: ConstructorLike) => {
  if (ctor === superCtor) return;

  Object.defineProperty(ctor, 'super_', {
    value: superCtor,
    writable: true,
    configurable: true,
  });

  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
};

if (!globalScope.util) {
  globalScope.util = {};
}

if (typeof globalScope.util.inherits !== 'function') {
  globalScope.util.inherits = ensureInherits;
}
