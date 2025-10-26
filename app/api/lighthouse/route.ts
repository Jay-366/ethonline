import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import lighthouse from '@lighthouse-web3/sdk'
import { join } from 'path'
import { tmpdir } from 'os'

// For encrypted file upload - using user wallet signature
const getAuthMessageAndSign = async (userAddress: string, userSignature: string) => {
  try {
    console.log('Getting auth message for address:', userAddress)
    
    // The signature provided should already be the signature of the auth message
    // so we can return it directly for uploadEncrypted
    console.log('Using provided user signature for upload')
    return userSignature
  } catch (error) {
    console.error('Error with user signature:', error)
    throw error
  }
}

const accessControl = async (cid: string, publicKey: string, signedMessage: string) => {
  try {
    console.log('Applying access control with:', { 
      cid, 
      publicKey,
      signedMessageLength: signedMessage?.length 
    })
    
    // Conditions to add - matching working example exactly
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
    
    console.log('Using conditions:', JSON.stringify(conditions, null, 2))

    // Aggregator - matching working example
    const aggregator = "([1])"
    
    console.log('Calling lighthouse.applyAccessCondition with exact parameter order from working example:')
    console.log('- publicKey:', publicKey)
    console.log('- cid:', cid)
    console.log('- signedMessage length:', signedMessage?.length)
    console.log('- conditions:', conditions.length, 'condition(s)')
    console.log('- aggregator:', aggregator)
    
    // Use exact same parameter order as working example:
    // applyAccessCondition(publicKey, cid, signedMessage, conditions, aggregator)
    const response = await lighthouse.applyAccessCondition(
      publicKey,    // owner's public key (userAddress)
      cid,          // CID of the file
      signedMessage, // message signed by the owner
      conditions,   // access conditions array
      aggregator    // aggregator string
    )

    console.log('Access conditions applied successfully:', response)
    return response
  } catch (error) {
    console.error('Access control error details:', error)
    console.error('Error type:', typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}

// POST: Upload and encrypt file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userAddress = formData.get('userAddress') as string | null
    const userSignature = formData.get('userSignature') as string | null
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      )
    }

    if (!userAddress || !userSignature) {
      return NextResponse.json(
        { error: 'User address and signature are required' },
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

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing LIGHTHOUSE_API_KEY in environment variables' },
        { status: 500 }
      )
    }

    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      userAddress: userAddress?.substring(0, 10) + '...',
      hasUserSignature: !!userSignature,
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

    const signedMessage = await getAuthMessageAndSign(userAddress, userSignature)
    console.log('Auth successful, signed message received')
    console.log('Upload parameters:', {
      tempPath,
      apiKeyLength: apiKey.length,
      userAddress,
      hasSignedMessage: !!signedMessage
    })
    
    // Try different parameter order based on lighthouse docs
    console.log('Attempting upload with parameters:', {
      tempPath,
      userAddress,
      apiKey: apiKey.substring(0, 8) + '...',
      signedMessage: signedMessage.substring(0, 10) + '...'
    })
    
    let response;
    try {
      response = await lighthouse.uploadEncrypted(
        tempPath,
        apiKey,
        userAddress,
        signedMessage
      )
      console.log('Upload response:', response)
    } catch (uploadError) {
      console.error('Detailed upload error:', uploadError)
      console.error('Error message:', uploadError instanceof Error ? uploadError.message : String(uploadError))
      console.error('Error stack:', uploadError instanceof Error ? uploadError.stack : 'No stack trace')
      throw new Error(`Lighthouse upload failed: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`)
    }

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
    const body = await request.json()
    const cid = body.cid as string | null
    const userAddress = body.userAddress as string | null
    const signedMessage = body.signedMessage as string | null

    console.log('PUT request received:', { 
      cid, 
      userAddress, 
      hasSignedMessage: !!signedMessage,
      signedMessageLength: signedMessage?.length 
    })

    if (!cid) {
      return NextResponse.json(
        { error: 'CID is required' },
        { status: 400 }
      )
    }

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      )
    }

    if (!signedMessage) {
      return NextResponse.json(
        { error: 'Signed message is required' },
        { status: 400 }
      )
    }

    // Validate inputs are not empty or just whitespace
    if (!cid.trim() || !userAddress.trim() || !signedMessage.trim()) {
      return NextResponse.json(
        { error: 'CID, user address, and signed message cannot be empty' },
        { status: 400 }
      )
    }

    console.log('Validated inputs, calling accessControl...')

    // Apply access conditions using the exact approach from working example
    let response;
    try {
      response = await accessControl(cid, userAddress, signedMessage)
      console.log('AccessControl returned:', response)
    } catch (accessError) {
      console.error('AccessControl failed:', accessError)
      console.error('AccessControl error type:', typeof accessError)
      console.error('AccessControl error message:', accessError instanceof Error ? accessError.message : String(accessError))
      
      // Provide more specific error message
      const errorMsg = accessError instanceof Error ? accessError.message : String(accessError)
      throw new Error(`Access control failed: ${errorMsg}`)
    }

    return NextResponse.json({
      success: true,
      response: response,
      cid: cid,
      userAddress: userAddress,
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

// For getting encryption key - using user wallet signature
const signAuthMessageForEncryption = async (userAddress: string, userSignature: string) => {
  // We don't need to get auth message again - the signature was already created for the correct message
  // Just return the signature that was passed in
  console.log('Using user signature for decryption:', userSignature.substring(0, 20) + '...');
  return userSignature;
}

// PATCH: Decrypt file (get signed message -> get encryption key -> attempt decrypt)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const cid = body.cid as string | undefined;
    const fileName = body.fileName as string | undefined;
    const userAddress = body.userAddress as string | undefined;
    const userSignature = body.userSignature as string | undefined;

    if (!cid) {
      return NextResponse.json({ error: 'CID is required' }, { status: 400 });
    }

    if (!userAddress || !userSignature) {
      return NextResponse.json({ error: 'User address and signature are required' }, { status: 400 });
    }

    // Sign auth message following the docs exactly
    const signedMessage = await signAuthMessageForEncryption(userAddress, userSignature);

    // Get encryption key following docs: fetchEncryptionKey(cid, userAddress, signedMessage)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let encryptionKeyResponse: any = null;
    try {
      console.log('Fetching encryption key with:', { cid, userAddress: userAddress.substring(0, 10) + '...', signedMessageLength: signedMessage.length });
      
      encryptionKeyResponse = await lighthouse.fetchEncryptionKey(
        cid,
        userAddress,
        signedMessage
      );
      console.log('Encryption key response:', encryptionKeyResponse);
    } catch (err) {
      console.error('Failed to get encryption key - Full error:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : String(err),
        type: typeof err,
        cid,
        userAddress
      });
      
      // Check if it's an access condition error
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('access') || errorMsg.includes('condition') || errorMsg.includes('denied')) {
        return NextResponse.json({ 
          error: 'Access denied. You must own at least 0.5 FormDataCoin tokens on Sepolia to decrypt this file.',
          detail: errorMsg,
          accessConditions: {
            chain: 'sepolia',
            tokenContract: '0x0b782612ff5e4E012485F85a80c5427C8A59A899',
            minimumBalance: '0.5 FormDataCoin'
          }
        }, { status: 403 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to get encryption key', 
        detail: errorMsg,
        hint: 'Make sure you have subscribed to this agent first (requires 0.5 FormDataCoin tokens on Sepolia)'
      }, { status: 500 });
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