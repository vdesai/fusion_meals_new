'use client';

import React from 'react';
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import { ClipboardCopy } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Create completely custom share button components that avoid the networkName prop issue
const CustomShareButton = ({ 
  onClick, 
  children,
  className = ""
}: { 
  onClick: () => void; 
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`share-button rounded-full p-0 bg-transparent border-none cursor-pointer ${className}`}
    type="button"
  >
    {children}
  </button>
);

const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('🔗 Link copied to clipboard!');
    } catch {
      toast.error('❌ Failed to copy link.');
    }
  };

  // Open Facebook share dialog
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&hashtag=${encodeURIComponent('#FusionMeals')}`;
    window.open(facebookUrl, '_blank', 'width=550,height=400');
  };

  // Open Twitter share dialog
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=400');
  };

  // Open WhatsApp share dialog
  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
    window.open(whatsappUrl, '_blank', 'width=550,height=400');
  };

  return (
    <div className="mt-6 flex flex-wrap gap-4 items-center">
      <div>
        <CustomShareButton onClick={handleFacebookShare}>
          <FacebookIcon size={40} round />
        </CustomShareButton>
      </div>
      <div>
        <CustomShareButton onClick={handleTwitterShare}>
          <TwitterIcon size={40} round />
        </CustomShareButton>
      </div>
      <div>
        <CustomShareButton onClick={handleWhatsAppShare}>
          <WhatsappIcon size={40} round />
        </CustomShareButton>
      </div>
      <button
        onClick={copyToClipboard}
        className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all"
      >
        <ClipboardCopy className="mr-2" />
        Copy Link
      </button>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ShareButtons;
