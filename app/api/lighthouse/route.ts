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