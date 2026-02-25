'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function GoogleAd({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style,
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (isInitialized.current) return;

    // Check if AdSense is available
    const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
    if (!publisherId) {
      console.warn('Google AdSense Publisher ID not configured');
      return;
    }

    try {
      // Push the ad to be displayed
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isInitialized.current = true;
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  // Show placeholder if no publisher ID configured
  if (!publisherId) {
    return (
      <div
        className={`bg-slate-200/80 rounded-lg flex items-center justify-center ${className}`}
        style={style}
      >
        <span className="text-slate-500 text-sm">Ad Space</span>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        ...style,
      }}
      data-ad-client={publisherId}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
}
