'use client';

import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import { ClipboardCopy } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('🔗 Link copied to clipboard!');
    } catch {
      toast.error('❌ Failed to copy link.');
    }
  };

  return (
    <div className="mt-6 flex flex-wrap gap-4 items-center">
      <FacebookShareButton url={url} hashtag="#FusionMeals"> {/* 🔥 Updated here */}
        <FacebookIcon size={40} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={40} round />
      </TwitterShareButton>
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>
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
