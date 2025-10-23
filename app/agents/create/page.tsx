'use client';

import { Upload, Check, Copy, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Timeline } from '@/components/ui/timeline';
import FileUpload from '@/components/ui/file-upload';

export default function CreateAgentPage() {
  const [agentName, setAgentName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const categories = ['Trading', 'Research', 'Writing', 'Analytics', 'DeFi', 'NFT', 'Gaming', 'Social', 'Data Analysis', 'Content Creation'];

  // Handle file changes from FileUpload component
  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleAccessOption = (option: string) => {
    setSelectedAccessOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Validate required fields
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!agentName.trim()) {
      errors.push('Agent name is required');
    }
    if (!category) {
      errors.push('Category is required');
    }
    if (!description.trim()) {
      errors.push('Description is required');
    }
    if (selectedFiles.length === 0) {
      errors.push('Please upload at least one file');
    }
    if (selectedAccessOptions.length === 0) {
      errors.push('Please select at least one access option');
    }
    
    // Validate pricing based on selected options
    if (selectedAccessOptions.includes('subscribers') && !monthlyPrice.trim()) {
      errors.push('Monthly price is required for Subscribers option');
    }
    if (selectedAccessOptions.includes('payperuse') && !payPerUsePrice.trim()) {
      errors.push('Price per session is required for Pay-Per-Use option');
    }
    if (selectedAccessOptions.includes('tokengated')) {
      if (!tokenContractAddress.trim()) {
        errors.push('Token contract address is required for Token-Gated option');
      }
      if (!minTokenRequired.trim()) {
        errors.push('Minimum token amount is required for Token-Gated option');
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleUpload = () => {
    // Clear previous errors
    setValidationErrors([]);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
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
    setCopied(true);
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Timeline data for the upload steps
  const timelineData = [
    {
      title: "Step 1",
      subtitle: "Agent Information",
      description: "Provide basic details about your AI agent",
      content: (
        <div className="space-y-6">
          {/* Agent Name */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Agent Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter agent name"
              className="w-full h-12 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full h-12 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-left flex items-center justify-between hover:border-[#f8ede0]/60 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
                style={{ color: category ? '#f8ede0' : '#5d606c' }}
              >
                <span>{category || 'Select category'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#1C1F2B] border border-[#5d606c] rounded-md shadow-lg z-10 max-h-64 overflow-y-auto scrollbar-hide">
                  <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                    .scrollbar-hide {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                  `}</style>
                  <div className="py-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 hover:bg-[rgba(93,96,108,0.3)]"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: category === cat ? '#f8ede0' : 'transparent',
                            border: `2px solid ${category === cat ? '#f8ede0' : '#5d606c'}`,
                          }}
                        >
                          {category === cat && (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#161823' }} />
                          )}
                        </div>
                        <span className="text-[#f8ede0]">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your agent's capabilities and use cases"
              rows={5}
              className="w-full px-4 py-3 rounded-md outline-none transition-all duration-300 resize-none bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2",
      subtitle: "Upload & Security",
      description: "Upload your model files and configure encryption",
      content: (
        <div className="space-y-6">
          {/* File Upload Component */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Model or Dataset File <span className="text-red-500">*</span>
            </label>
            <FileUpload onFilesChange={handleFilesChange} />
          </div>

          {/* Encryption Toggle */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              File Encryption
            </label>
            <div className="flex items-center justify-between p-4 rounded-md border border-[#5d606c]">
              <div>
                <label className="block text-sm font-medium text-[#f8ede0] mb-1">
                  Encrypt this file before upload
                </label>
                <p className="text-xs text-[#5d606c]">Secure your agent with Lighthouse encryption</p>
              </div>
              <button
                onClick={() => setEncryptionEnabled(!encryptionEnabled)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: encryptionEnabled ? '#f8ede0' : '#5d606c' }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full transition-transform"
                  style={{
                    transform: encryptionEnabled ? 'translateX(24px)' : 'translateX(4px)',
                    backgroundColor: encryptionEnabled ? '#161823' : '#fff',
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3",
      subtitle: "Access & Pricing",
      description: "Choose how users can access and pay for your agent",
      content: (
        <div className="space-y-6">
          {/* Pricing Options Section */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Monetization Options <span className="text-red-500">*</span>
            </label>
            {/* Option Cards - 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Subscribers (monthly-based) */}
            <div
              className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
              style={{
                backgroundColor: '#1C1F2B',
                border: selectedAccessOptions.includes('subscribers') ? '1px solid #f8ede0' : '1px solid #5d606c',
              }}
              onClick={() => toggleAccessOption('subscribers')}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    backgroundColor: selectedAccessOptions.includes('subscribers') ? '#f8ede0' : 'transparent',
                    border: `2px solid ${selectedAccessOptions.includes('subscribers') ? '#f8ede0' : '#5d606c'}`,
                  }}
                >
                  {selectedAccessOptions.includes('subscribers') && (
                    <Check className="w-4 h-4" style={{ color: '#161823' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-[#f8ede0]">
                    Subscribers (monthly-based)
                  </h4>
                  <p className="text-sm mb-3 text-[#5d606c]">
                    Users pay a recurring monthly fee to access this agent.
                  </p>

                  {selectedAccessOptions.includes('subscribers') && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <label className="block mb-2 text-sm text-[#f8ede0]">
                        Monthly Subscription Price (ETH)
                      </label>
                      <input
                        type="text"
                        value={monthlyPrice}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          setMonthlyPrice(value);
                        }}
                        placeholder="e.g. 0.019"
                        className="h-11 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60"
                        style={{ width: '200px' }}
                      />
                      <p className="mt-2 text-sm text-[#5d606c]">
                        Renewal every 30 days • Access verified via subscription contract.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Pay-Per-Use (session-based) */}
            <div
              className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
              style={{
                backgroundColor: '#1C1F2B',
                border: selectedAccessOptions.includes('payperuse') ? '1px solid #f8ede0' : '1px solid #5d606c',
              }}
              onClick={() => toggleAccessOption('payperuse')}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    backgroundColor: selectedAccessOptions.includes('payperuse') ? '#f8ede0' : 'transparent',
                    border: `2px solid ${selectedAccessOptions.includes('payperuse') ? '#f8ede0' : '#5d606c'}`,
                  }}
                >
                  {selectedAccessOptions.includes('payperuse') && (
                    <Check className="w-4 h-4" style={{ color: '#161823' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-[#f8ede0]">
                    Pay-Per-Use (session-based)
                  </h4>
                  <p className="text-sm mb-3 text-[#5d606c]">
                    Users pay a small fee each time they use or chat with this agent.
                  </p>

                  {selectedAccessOptions.includes('payperuse') && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <label className="block mb-2 text-sm text-[#f8ede0]">
                        Price Per Session (ETH)
                      </label>
                      <input
                        type="text"
                        value={payPerUsePrice}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          setPayPerUsePrice(value);
                        }}
                        placeholder="e.g. 0.005"
                        className="h-11 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60"
                        style={{ width: '200px' }}
                      />
                      <p className="mt-2 text-sm text-[#5d606c]">
                        Access granted for 1 session after payment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Token-Gated Access (holder-based) */}
            <div
              className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
              style={{
                backgroundColor: '#1C1F2B',
                border: selectedAccessOptions.includes('tokengated') ? '1px solid #f8ede0' : '1px solid #5d606c',
              }}
              onClick={() => toggleAccessOption('tokengated')}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    backgroundColor: selectedAccessOptions.includes('tokengated') ? '#f8ede0' : 'transparent',
                    border: `2px solid ${selectedAccessOptions.includes('tokengated') ? '#f8ede0' : '#5d606c'}`,
                  }}
                >
                  {selectedAccessOptions.includes('tokengated') && (
                    <Check className="w-4 h-4" style={{ color: '#161823' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-[#f8ede0]">
                    Token-Gated Access (holder-based)
                  </h4>
                  <p className="text-sm mb-3 text-[#5d606c]">
                    Access unlocked by holding a specific token or NFT.
                  </p>

                  {selectedAccessOptions.includes('tokengated') && (
                    <div onClick={(e) => e.stopPropagation()} className="space-y-3">
                      <div>
                        <label className="block mb-2 text-sm text-[#f8ede0]">
                          Token Contract Address
                        </label>
                        <input
                          type="text"
                          value={tokenContractAddress}
                          onChange={(e) => setTokenContractAddress(e.target.value)}
                          placeholder="0x..."
                          className="w-full h-11 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm text-[#f8ede0]">
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
                          className="h-11 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60"
                          style={{ width: '100px' }}
                        />
                      </div>
                      <p className="text-sm text-[#5d606c]">
                        File encrypted via Lighthouse • only token holders can decrypt.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Public (free access) */}
            <div
              className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
              style={{
                backgroundColor: '#1C1F2B',
                border: selectedAccessOptions.includes('public') ? '1px solid #f8ede0' : '1px solid #5d606c',
              }}
              onClick={() => toggleAccessOption('public')}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    backgroundColor: selectedAccessOptions.includes('public') ? '#f8ede0' : 'transparent',
                    border: `2px solid ${selectedAccessOptions.includes('public') ? '#f8ede0' : '#5d606c'}`,
                  }}
                >
                  {selectedAccessOptions.includes('public') && (
                    <Check className="w-4 h-4" style={{ color: '#161823' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-[#f8ede0]">
                    Public (free access)
                  </h4>
                  <p className="text-sm mb-3 text-[#5d606c]">
                    Anyone can access this agent freely — no payment or token required.
                  </p>
                  {selectedAccessOptions.includes('public') && (
                    <p className="text-sm text-[#5d606c]">
                      Suitable for demos or community agents.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Summary Line */}
          {selectedAccessOptions.length > 0 && (
            <div className="mt-6 p-4 rounded-md border border-[#5d606c]" style={{ backgroundColor: '#1C1F2B' }}>
              <div className="text-sm text-[#5d606c]">
                <span className="mr-2">Selected Options:</span>
                <span className="text-[#f8ede0] font-medium">
                  {selectedAccessOptions.map((option) => {
                    const labels: Record<string, string> = {
                      subscribers: 'Subscribers',
                      payperuse: 'Pay-Per-Use',
                      tokengated: 'Token-Gated',
                      public: 'Public',
                    };
                    return labels[option];
                  }).join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Step 4",
      subtitle: "Review & Deploy",
      description: "Review your configuration and upload to Lighthouse",
      content: (
        <div className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="rounded-md p-4 border border-red-500" style={{ backgroundColor: '#1C1F2B' }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-500 mb-2">
                    Please complete the following required fields:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-400">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Deploy Section */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Deploy Your Agent
            </label>
            {/* Submit Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full h-14 rounded-md text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#f8ede0',
                color: '#161823',
                boxShadow: '0 4px 12px rgba(248, 237, 224, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (!isUploading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(248, 237, 224, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isUploading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 237, 224, 0.2)';
                }
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {isUploading ? 'Uploading...' : 'Upload to Lighthouse'}
                </span>
              </div>
            </button>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#f8ede0]">Uploading to Lighthouse...</span>
                <span className="text-[#f8ede0] font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#5d606c' }}>
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: '#f8ede0',
                  }}
                />
              </div>
            </div>
          )}

          {/* Upload Success Message */}
          {uploadSuccess && (
            <div
              className="rounded-md p-6 flex items-center justify-between border border-[#f8ede0]"
              style={{ backgroundColor: '#1C1F2B' }}
            >
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6" style={{ color: '#f8ede0' }} />
                <div>
                  <div className="mb-1 text-[#f8ede0] font-medium">
                    Upload successful!
                  </div>
                  <div className="text-sm text-[#5d606c] font-mono">
                    CID: {cid}
                  </div>
                </div>
              </div>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 bg-transparent border border-[#f8ede0] text-[#f8ede0] hover:bg-[#f8ede0] hover:text-[#161823]"
                style={copied ? { backgroundColor: '#f8ede0', color: '#161823' } : {}}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy CID
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#161823]">
      {/* Header Section - Matching CategoryHeader */}
      <section className="max-w-[1400px] mx-auto px-6 pt-24 pb-0 bg-gradient-to-r from-[#161823] to-[#161823] text-[#f8ede0]">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-[#5d606c]">
          <Link href="/" className="hover:underline cursor-pointer">Home</Link> 
          <span className="mx-1">&gt;</span> 
          <Link href="/agents" className="hover:underline cursor-pointer">My Agents</Link>
          <span className="mx-1">&gt;</span>
          <Link href="/agents/create" className="hover:underline cursor-pointer text-[#f8ede0]">Create Agent</Link>
        </nav>

        {/* Title and subtitle */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Upload Your Agent</h1>
        <p className="text-base md:text-lg text-[#5d606c] mb-6">Store your AI securely with Lighthouse integration and monetize on the marketplace.</p>
      </section>

      {/* Timeline Section */}
      <Timeline data={timelineData} />

      {/* Footer */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 text-center">
        <span className="text-[#5d606c]">
          Need help?{' '}
          <a
            href="#"
            className="text-[#f8ede0] hover:underline transition-all"
          >
            Visit Support
          </a>
        </span>
      </div>
    </div>
  );
}
