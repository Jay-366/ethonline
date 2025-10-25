import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { ethers } from 'ethers'
import lighthouse from '@lighthouse-web3/sdk'
import kavach from '@lighthouse-web3/kavach'
import { join } from 'path'
import { tmpdir } from 'os'

// For encrypted file upload - try direct signing approach
const signAuthMessage = async (privateKey: string) => {
  try {
    const signer = new ethers.Wallet(privateKey)
    console.log('Signer address:', signer.address)
    
    // Try the lighthouse auth method first
    const authResponse = await lighthouse.getAuthMessage(signer.address)
    if (!authResponse || !authResponse.data || !authResponse.data.message) {
      throw new Error('Failed to get auth message from lighthouse')
    }
    
    const signedMessage = await signer.signMessage(authResponse.data.message)
    console.log('Signed message for upload:', !!signedMessage)
    return signedMessage
  } catch (error) {
    console.error('Direct lighthouse auth failed, trying kavach...', error)
    
    // Fallback to kavach method
    const signer = new ethers.Wallet(privateKey)
    const authMessage = await kavach.getAuthMessage(signer.address)
    if (!authMessage || !authMessage.message) {
      throw new Error('Failed to get auth message from kavach')
    }
    const { JWT } = await kavach.getJWT(signer.address, await signer.signMessage(authMessage.message))
    return JWT
  }
}

// For access conditions
const signAuthMessageForConditions = async (privateKey: string) => {
  const signer = new ethers.Wallet(privateKey)
  const authResponse = await lighthouse.getAuthMessage(signer.address)
  if (!authResponse || !authResponse.data || !authResponse.data.message) {
    throw new Error('Failed to get auth message from lighthouse')
  }
  const signedMessage = await signer.signMessage(authResponse.data.message)
  return signedMessage
}

const accessControl = async (cid: string, publicKey: string, privateKey: string) => {
  try {
    // Conditions to add
    const conditions = [
      {
        id: 1,
        chain: "sepolia",
        method: "balanceOf",
        standardContractType: "ERC20",
        contractAddress: "0x0b782612ff5e4E012485F85a80c5427C8A59A899",
        returnValueTest: {
          comparator: ">=",
          value: "500000000000000000"
        },
        parameters: [":userAddress"],
      },
    ]

    // Aggregator is what kind of operation to apply to access conditions
    const aggregator = "([1])"

    const signedMessage = await signAuthMessageForConditions(privateKey)
    
    const response = await lighthouse.applyAccessCondition(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator
    )

    return response
  } catch (error) {
    throw error
  }
}

// POST: Upload and encrypt file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      )
    }

    // Create temp file with simple name (no timestamp)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const tempPath = join(tmpdir(), file.name)
    await writeFile(tempPath, buffer)

    console.log('File saved to tempPath:', tempPath)
    console.log('File name:', file.name)
    console.log('File size:', file.size)

    const apiKey = process.env.LIGHTHOUSE_API_KEY
    const publicKey = process.env.WALLET_PUBLIC_KEY
    const privateKey = process.env.WALLET_PRIVATE_KEY

    if (!apiKey || !publicKey || !privateKey) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      )
    }

    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      hasPublicKey: !!publicKey,
      hasPrivateKey: !!privateKey,
      publicKey: publicKey?.substring(0, 10) + '...',
      apiKeyPrefix: apiKey?.substring(0, 8) + '...'
    })

    // Test API key with a simple call
    try {
      console.log('Testing API key...')
      const testResponse = await lighthouse.getUploads(apiKey)
      console.log('API key test successful:', !!testResponse)
    } catch (testError) {
      console.error('API key test failed:', testError)
      return NextResponse.json(
        { error: `Invalid API key: ${testError instanceof Error ? testError.message : 'API key validation failed'}` },
        { status: 500 }
      )
    }

    const signedMessage = await signAuthMessage(privateKey)
    console.log('Auth successful, JWT token received')
    console.log('Upload parameters:', {
      tempPath,
      apiKeyLength: apiKey.length,
      publicKey,
      hasJWT: !!signedMessage
    })
    
    const response = await lighthouse.uploadEncrypted(
      tempPath,
      apiKey,
      publicKey,
      signedMessage
    )
    
    console.log('Upload response:', response)

    // Include tempPath in response for debugging
    return NextResponse.json({
      ...response,
      debug: {
        tempPath,
        fileName: file.name,
        fileSize: file.size
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

// PUT: Apply access conditions to encrypted file
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const cid = formData.get('cid') as string | null

    if (!cid) {
      return NextResponse.json(
        { error: 'CID is required' },
        { status: 400 }
      )
    }

    // Get private key and public key from environment variables
    const privateKey = process.env.WALLET_PRIVATE_KEY
    const publicKey = process.env.WALLET_PUBLIC_KEY

    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { error: 'WALLET_PRIVATE_KEY and WALLET_PUBLIC_KEY must be set in environment variables' },
        { status: 500 }
      )
    }

    // Debug logging
    console.log('Applying conditions with:', {
      cid: cid,
      publicKey: publicKey,
      privateKeyConfigured: !!privateKey
    })

    // Apply access conditions using the official code
    const response = await accessControl(cid, publicKey, privateKey)

    return NextResponse.json({
      success: true,
      response: response,
      cid: cid,
      publicKey: publicKey,
      conditions: [
        {
          id: 1,
          chain: "sepolia",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0x0b782612ff5e4E012485F85a80c5427C8A59A899",
          returnValueTest: {
            comparator: ">=",
            value: "500000000000000000"
          },
          parameters: [":userAddress"],
        },
      ],
      aggregator: "([1])"
    })

  } catch (error) {
    console.error('Apply conditions error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to apply access conditions' },
      { status: 500 }
    )
  }
}

// File type detection based on magic bytes/signatures - using proven working approach
const detectFileType = (buffer: Buffer): { extension: string; mimeType: string } => {
  let fileExtension = 'bin';
  let mimeType = 'application/octet-stream';
  
  // Simple file type detection based on file headers
  if (buffer.length > 0) {
    const header = buffer.subarray(0, 16).toString('hex');
    console.log('File header (hex):', header);
    
    if (header.startsWith('89504e47')) {
      fileExtension = 'png';
      mimeType = 'image/png';
    } else if (header.startsWith('ffd8ff')) {
      fileExtension = 'jpg';
      mimeType = 'image/jpeg';
    } else if (header.startsWith('474946')) {
      fileExtension = 'gif';
      mimeType = 'image/gif';
    } else if (header.startsWith('25504446')) {
      fileExtension = 'pdf';
      mimeType = 'application/pdf';
    } else if (header.startsWith('504b0304') || header.startsWith('504b0506') || header.startsWith('504b0708')) {
      fileExtension = 'zip';
      mimeType = 'application/zip';
    } else if (header.startsWith('1f8b08')) {
      fileExtension = 'gz';
      mimeType = 'application/gzip';
    } else if (header.startsWith('425a68') || header.startsWith('425a')) {
      fileExtension = 'bz2';
      mimeType = 'application/x-bzip2';
    } else if (header.startsWith('377abcaf271c') || header.startsWith('fd377a585a00')) {
      fileExtension = 'xz';
      mimeType = 'application/x-xz';
    } else if (buffer.length >= 512) {
      // Check for TAR file signature
      const tarCheck = buffer.subarray(257, 262).toString('ascii');
      if (tarCheck === 'ustar' || tarCheck.startsWith('ustar')) {
        fileExtension = 'tar';
        mimeType = 'application/x-tar';
      } else {
        // Alternative TAR detection
        const possibleFilename = buffer.subarray(0, 100).toString('ascii').replace(/\0.*$/, '');
        const hasNullPadding = buffer.subarray(100, 156).every(byte => byte === 0 || (byte >= 32 && byte <= 126));
        if (possibleFilename.length > 0 && hasNullPadding) {
          fileExtension = 'tar';
          mimeType = 'application/x-tar';
        }
      }
    }
    
    // Text file detection (moved to end to avoid false positives)
    if (fileExtension === 'bin') {
      if (buffer.toString('utf8', 0, Math.min(100, buffer.length)).includes('<!DOCTYPE html') || 
          buffer.toString('utf8', 0, Math.min(100, buffer.length)).includes('<html')) {
        fileExtension = 'html';
        mimeType = 'text/html';
      } else {
        // Check if it looks like text
        const sample = buffer.toString('utf8', 0, Math.min(1000, buffer.length));
        const printableRatio = (sample.match(/[\x20-\x7E\n\r\t]/g) || []).length / sample.length;
        if (printableRatio > 0.8) {
          fileExtension = 'txt';
          mimeType = 'text/plain';
        }
      }
    }
  }
  
  console.log(`Detected file type: ${fileExtension} (${mimeType})`);
  return { extension: fileExtension, mimeType: mimeType };
}

// For getting encryption key - following docs exactly
const signAuthMessageForEncryption = async (privateKey: string) => {
  const signer = new ethers.Wallet(privateKey)
  const authResponse = await lighthouse.getAuthMessage(signer.address)
  if (!authResponse || !authResponse.data || !authResponse.data.message) {
    throw new Error('Failed to get auth message from lighthouse')
  }
  const messageRequested = authResponse.data.message
  const signedMessage = await signer.signMessage(messageRequested)
  return signedMessage
}

// PATCH: Decrypt file (get signed message -> get encryption key -> attempt decrypt)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const cid = body.cid as string | undefined;
    const fileName = body.fileName as string | undefined;

    if (!cid) {
      return NextResponse.json({ error: 'CID is required' }, { status: 400 });
    }

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    const publicKey = process.env.WALLET_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return NextResponse.json({ error: 'WALLET_PRIVATE_KEY and WALLET_PUBLIC_KEY must be set' }, { status: 500 });
    }

    // Sign auth message following the docs exactly
    const signedMessage = await signAuthMessageForEncryption(privateKey);

    // Get encryption key following docs: fetchEncryptionKey(cid, publicKey, signedMessage)
    let encryptionKeyResponse: any = null;
    try {
      encryptionKeyResponse = await lighthouse.fetchEncryptionKey(
        cid,
        publicKey,
        signedMessage
      );
      console.log('Encryption key response:', encryptionKeyResponse);
    } catch (err) {
      console.error('Failed to get encryption key:', err);
      return NextResponse.json({ error: 'Failed to get encryption key', detail: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }

    // Extract the actual key from response.data.key
    const encryptionKey = encryptionKeyResponse?.data?.key;
    if (!encryptionKey) {
      return NextResponse.json({ error: 'No encryption key in response', response: encryptionKeyResponse }, { status: 500 });
    }

    // Decrypt File using the exact same approach as your working code
    const decrypted = await lighthouse.decryptFile(
      cid,
      encryptionKeyResponse.data.key
    );

    console.log('Decryption result type:', typeof decrypted);
    console.log('Decryption result length:', decrypted ? decrypted.length : 'null/undefined');

    if (!decrypted || decrypted.length === 0) {
      console.error('Decryption failed or returned empty result');
      return NextResponse.json({ error: 'Failed to decrypt file or file is empty' }, { status: 500 });
    }

    console.log('File decrypted successfully, size:', decrypted.length);
    
    // Log first few bytes to debug
    if (decrypted.length > 0) {
      const firstBytes = Buffer.from(decrypted.slice(0, 16)).toString('hex');
      console.log('First 16 bytes (hex):', firstBytes);
    }

    // File type detection using the exact same logic as your working code
    const buffer = Buffer.from(decrypted);
    const { extension, mimeType } = detectFileType(buffer);
    
    const detectedFileName = fileName ? 
      `${fileName.replace(/\.[^/.]+$/, '')}.${extension}` : 
      `decrypted_${cid.slice(0, 8)}.${extension}`;

    // Create base64 data for download (following your working approach)
    const fileBuffer = Buffer.from(decrypted);
    const base64Data = fileBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      fileBase64: base64Data,
      fileName: detectedFileName,
      mimeType: mimeType,
      detectedExtension: extension,
      fileSize: decrypted.length,
      message: 'File decrypted successfully'
    });
  } catch (error) {
    console.error('Decrypt endpoint error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Decrypt failed' }, { status: 500 });
  }
}