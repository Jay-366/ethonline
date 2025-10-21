'use client';

import { Upload, Check, Copy } from 'lucide-react';
import { useState, useRef } from 'react';

export default function CreateAgentPage() {
  const [agentName, setAgentName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [selectedAccessOptions, setSelectedAccessOptions] = useState<string[]>([]);
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [payPerUsePrice, setPayPerUsePrice] = useState('');
  const [tokenContractAddress, setTokenContractAddress] = useState('');
  const [minTokenRequired, setMinTokenRequired] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cid, setCid] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Trading', 'Research', 'Writing', 'Analytics'];
  
  const toggleAccessOption = (option: string) => {
    setSelectedAccessOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          setCid('QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cid);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b" style={{ borderColor: 'rgba(80, 96, 108, 0.4)' }}>
        <h1 className="mb-2" style={{ color: '#FBede0', fontSize: '36px' }}>
          Upload Your Agent
        </h1>
        <p style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
          Store your AI securely with Lighthouse integration.
        </p>
      </div>

      {/* Main Upload Form */}
      <div className="max-w-[960px] mx-auto space-y-8">
        {/* Agent Name */}
        <div>
          <label className="block mb-3" style={{ color: '#FBede0', fontSize: '14px' }}>
            Agent Name
          </label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="Enter agent name"
            className="w-full h-12 px-4 rounded-xl outline-none transition-all"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
              color: '#FBede0',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#FBede0';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(251, 237, 224, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(80, 96, 108, 0.4)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-3" style={{ color: '#FBede0', fontSize: '14px' }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-12 px-4 rounded-xl outline-none transition-all"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
              color: category ? '#FBede0' : 'rgba(251, 237, 224, 0.6)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#FBede0';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(251, 237, 224, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(80, 96, 108, 0.4)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-3" style={{ color: '#FBede0', fontSize: '14px' }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your agent's capabilities and use cases"
            rows={5}
            className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
              color: '#FBede0',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#FBede0';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(251, 237, 224, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(80, 96, 108, 0.4)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* File Upload Section */}
        <div>
          <label className="block mb-3" style={{ color: '#FBede0', fontSize: '14px' }}>
            Upload Model or Dataset File
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="relative cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: '#1C1F2B',
              border: `2px dashed ${isDragging ? '#FBede0' : 'rgba(80, 96, 108, 0.4)'}`,
              borderRadius: '16px',
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".zip,.json,.csv"
            />
            <div className="text-center">
              <div className="text-4xl mb-3">📂</div>
              <div className="mb-2" style={{ color: '#FBede0' }}>
                {selectedFile ? selectedFile.name : 'Drag & drop or click to upload'}
              </div>
              <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.5)' }}>
                Supported formats: .zip, .json, .csv
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-4">
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(80, 96, 108, 0.4)' }}
              >
                <div
                  className="h-full transition-all duration-200"
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: '#FBede0',
                  }}
                />
              </div>
              <div className="mt-2 text-sm" style={{ color: '#FBede0' }}>
                Uploading... {uploadProgress}%
              </div>
            </div>
          )}
        </div>

        {/* Encryption Toggle */}
        <div className="flex items-center justify-between">
          <label style={{ color: '#FBede0', fontSize: '14px' }}>
            Encrypt this file before upload
          </label>
          <button
            onClick={() => setEncryptionEnabled(!encryptionEnabled)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{ backgroundColor: encryptionEnabled ? '#FBede0' : 'rgba(80, 96, 108, 0.4)' }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              style={{
                transform: encryptionEnabled ? 'translateX(24px)' : 'translateX(4px)',
              }}
            />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(80, 96, 108, 0.4)', margin: '40px 0' }} />

        {/* Access & Pricing Options */}
        <div>
          <h3 className="mb-2" style={{ color: '#FBede0' }}>
            Access & Pricing Options
          </h3>
          <p className="mb-6" style={{ color: 'rgba(251, 237, 224, 0.7)', fontSize: '16px' }}>
            Choose how users can access and pay for your agent. You may select more than one.
          </p>

          {/* Option Cards */}
          <div className="space-y-4">
            {/* 1. Subscribers (monthly-based) */}
            <div
              className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: '#1C1F2B',
                border: selectedAccessOptions.includes('subscribers') ? '1px solid #FBede0' : '1px solid rgba(80, 96, 108, 0.4)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                borderLeft: selectedAccessOptions.includes('subscribers') ? '4px solid #FBede0' : '1px solid rgba(80, 96, 108, 0.4)',
              }}
              onClick={() => toggleAccessOption('subscribers')}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    backgroundColor: selectedAccessOptions.includes('subscribers') ? '#FBede0' : '#1C1F2B',
                    border: `2px solid ${selectedAccessOptions.includes('subscribers') ? '#FBede0' : 'rgba(80, 96, 108, 0.4)'}`,
                  }}
                >
                  {selectedAccessOptions.includes('subscribers') && (
                    <Check className="w-4 h-4" style={{ color: '#161823' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1" style={{ color: '#FBede0' }}>
                    Subscribers (monthly-based)
                  </h4>
                  <p className="text-sm mb-3" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Users pay a recurring monthly fee to access this agent.
                  </p>

                  {selectedAccessOptions.includes('subscribers') && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <label className="block mb-2 text-sm" style={{ color: '#FBede0' }}>
                        Monthly Subscription Price (USD or DataCoin)
                      </label>
                      <input
                        type="text"
                        value={monthlyPrice}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          setMonthlyPrice(value);
                        }}
                        placeholder="e.g. 19.00"
                        className="h-11 px-4 rounded-xl outline-none transition-all"
                        style={{
                          backgroundColor: '#161823',
                          border: '1px solid rgba(80, 96, 108, 0.4)',
                          color: '#FBede0',
                          width: '200px',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#FBede0';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(80, 96, 108, 0.4)';
                        }}
                      />
                      <p className="mt-2 text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                        Renewal every 30 days • Access verified via subscription contract.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Pay-Per-Use (session-based) */}
            <div
              className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: '#1C1F2B',
                border: selectedAccessOptions.includes('payperuse') ? '1px solid #FBede0' : '1px solid rgba(80, 96, 108, 0.4)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                borderLeft: selectedAccessOptions.includes('payperuse') ? '4px solid #FBede0' : '1px solid rgba(80, 96, 108, 0.4)',
              }}
              onClick={() => toggleAccessOption('payperuse')}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    backgroundColor: selectedAccessOptions.includes('payperuse') ? '#FBede0' : '#1C1F2B',
                    border: `2px solid ${selectedAccessOptions.includes('payperuse') ? '#FBede0' : 'rgba(80, 96, 108, 0.4)'}`,
                  }}
                >
                  {selectedAccessOptions.includes('payperuse') && (
                    <Check className="w-4 h-4" style={{ color: '#161823' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1" style={{ color: '#FBede0' }}>
                    Pay-Per-Use (session-based)
                  </h4>
                  <p className="text-sm mb-3" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Users pay a small fee each time they use or chat with this agent.
                  </p>

                  {selectedAccessOptions.includes('payperuse') && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <label className="block mb-2 text-sm" style={{ color: '#FBede0' }}>
                        Price Per Session (USD or DataCoin)
                      </label>
                      <input
                        type="text"
                        value={payPerUsePrice}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          setPayPerUsePrice(value);
                        }}
                        placeholder="e.g. 0.50"
                        className="h-11 px-4 rounded-xl outline-none transition-all"
                        style={{
                          backgroundColor: '#161823',
                          border: '1px solid rgba(80, 96, 108, 0.4)',
                          color: '#FBede0',
                          width: '200px',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#FBede0';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(80, 96, 108, 0.4)';
                        }}
                      />
                      <p className="mt-2 text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                        Access granted for 1 session after payment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Token-Gated Access (holder-based) */}
            <div
              className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: '#1C1F2B',
                border: selectedAccessOptions.includes('tokengated') ? '1px solid #FBede0' : '1px solid rgba(80, 96, 108, 0.4)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                borderLeft: selectedAccessOptions.includes('tokengated') ? '4px solid #FBede0' : '1px solid rgba(80, 96, 108, 0.4)',
              }}
              onClick={() => toggleAccessOption('tokengated')}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    backgroundColor: selectedAccessOptions.includes('tokengated') ? '#FBede0' : '#1C1F2B',
                    border: `2px solid ${selectedAccessOptions.includes('tokengated') ? '#FBede0' : 'rgba(80, 96, 108, 0.4)'}`,
                  }}
                >
                  {selectedAccessOptions.includes('tokengated') && (
                    <Check className="w-4 h-4" style={{ color: '#161823' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1" style={{ color: '#FBede0' }}>
                    Token-Gated Access (holder-based)
                  </h4>
                  <p className="text-sm mb-3" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Access unlocked by holding a specific token or NFT.
                  </p>

                  {selectedAccessOptions.includes('tokengated') && (
                    <div onClick={(e) => e.stopPropagation()} className="space-y-3">
                      <div>
                        <label className="block mb-2 text-sm" style={{ color: '#FBede0' }}>
                          Token Contract Address
                        </label>
                        <input
                          type="text"
                          value={tokenContractAddress}
                          onChange={(e) => setTokenContractAddress(e.target.value)}
                          placeholder="0x..."
                          className="w-full h-11 px-4 rounded-xl outline-none transition-all"
                          style={{
                            backgroundColor: '#161823',
                            border: '1px solid rgba(80, 96, 108, 0.4)',
                            color: '#FBede0',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#FBede0';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(80, 96, 108, 0.4)';
                          }}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm" style={{ color: '#FBede0' }}>
                          Minimum Token Required
                        </label>
                        <input
                          type="text"
                          value={minTokenRequired}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setMinTokenRequired(value);
                          }}
                          placeholder="1"
                          className="h-11 px-4 rounded-xl outline-none transition-all"
                          style={{
                            backgroundColor: '#161823',
                            border: '1px solid rgba(80, 96, 108, 0.4)',
                            color: '#FBede0',
                            width: '100px',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#FBede0';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(80, 96, 108, 0.4)';
                          }}
                        />
                      </div>
                      <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                        File encrypted via Lighthouse • only token holders can decrypt.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Public (free access) */}
            <div
              className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: '#1C1F2B',
                border: selectedAccessOptions.includes('public') ? '1px solid #FBede0' : '1px solid rgba(80, 96, 108, 0.4)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                borderLeft: selectedAccessOptions.includes('public') ? '4px solid #FBede0' : '1px solid rgba(80, 96, 108, 0.4)',
              }}
              onClick={() => toggleAccessOption('public')}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    backgroundColor: selectedAccessOptions.includes('public') ? '#FBede0' : '#1C1F2B',
                    border: `2px solid ${selectedAccessOptions.includes('public') ? '#FBede0' : 'rgba(80, 96, 108, 0.4)'}`,
                  }}
                >
                  {selectedAccessOptions.includes('public') && (
                    <Check className="w-4 h-4" style={{ color: '#161823' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1" style={{ color: '#FBede0' }}>
                    Public (free access)
                  </h4>
                  <p className="text-sm mb-3" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Anyone can access this agent freely — no payment or token required.
                  </p>
                  {selectedAccessOptions.includes('public') && (
                    <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                      Suitable for demos or community agents.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Line */}
          {selectedAccessOptions.length > 0 && (
            <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(80, 96, 108, 0.2)' }}>
              <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
                <span className="mr-2">Selected Options:</span>
                <span style={{ color: '#FBede0' }}>
                  {selectedAccessOptions.map((option) => {
                    const labels: Record<string, string> = {
                      subscribers: 'Subscribers (monthly-based)',
                      payperuse: 'Pay-Per-Use (session-based)',
                      tokengated: 'Token-Gated Access (holder-based)',
                      public: 'Public (free access)',
                    };
                    return labels[option];
                  }).join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className="w-full h-14 rounded-xl text-white transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #FBede0 0%, #e8d4c5 100%)',
            boxShadow: '0 4px 12px rgba(251, 237, 224, 0.2)',
            opacity: (!selectedFile || isUploading) ? 0.6 : 1,
            cursor: (!selectedFile || isUploading) ? 'not-allowed' : 'pointer',
            color: '#161823',
          }}
          onMouseEnter={(e) => {
            if (!isUploading && selectedFile) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(251, 237, 224, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isUploading && selectedFile) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 237, 224, 0.2)';
            }
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            <span style={{ fontSize: '18px' }}>Upload to Lighthouse</span>
          </div>
        </button>

        {/* Upload Success Message */}
        {uploadSuccess && (
          <div
            className="rounded-2xl p-6 flex items-center justify-between"
            style={{
              backgroundColor: 'rgba(80, 96, 108, 0.2)',
              border: '1px solid #FBede0',
            }}
          >
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6" style={{ color: '#FBede0' }} />
              <div>
                <div className="mb-1" style={{ color: '#FBede0' }}>
                  ✅ Upload successful!
                </div>
                <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.8)', fontFamily: 'monospace' }}>
                  CID: {cid}
                </div>
              </div>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #FBede0',
                color: '#FBede0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FBede0';
                e.currentTarget.style.color = '#161823';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#FBede0';
              }}
            >
              <Copy className="w-4 h-4" />
              Copy CID
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 py-6 text-center">
        <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
          Need help?{' '}
          <a
            href="#"
            className="transition-all"
            style={{ color: '#FBede0' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Visit Support
          </a>
        </span>
      </div>
    </div>
  );
}
