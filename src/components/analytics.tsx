'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
  }
}

export function Analytics() {
  useEffect(() => {
    // Google Analytics 4
    if (process.env.NEXT_PUBLIC_GA_ID) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
      document.head.appendChild(script)

      window.gtag = window.gtag || function() {
        (window.gtag as any).q = (window.gtag as any).q || []
        ;(window.gtag as any).q.push(arguments)
      }

      window.gtag('js', new Date())
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!)
    }

    // Meta Pixel
    if (process.env.NEXT_PUBLIC_META_PIXEL_ID) {
      const script = document.createElement('script')
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(script)
    }
  }, [])

  return null
}

// Analytics tracking functions
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters)
  }
}

export function trackConversion(eventName: string, value?: number, currency = 'USD') {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      value: value,
      currency: currency,
    })
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, {
      value: value,
      currency: currency,
    })
  }
}
