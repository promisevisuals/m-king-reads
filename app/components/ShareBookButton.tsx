'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

export default function ShareBookButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  async function share() {
    if (sharing) return;
    setSharing(true);
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: title + ' — M King Reads', text: `📖 I'm reading “${title}” on M King Reads and I think you'll love it! It's free to read on your phone — come read with me ✨`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {} finally {
      setSharing(false);
    }
  }

  return (
    <button className="btn btnGhost" onClick={share} disabled={sharing}>
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {sharing ? 'Sharing…' : copied ? 'Link copied' : 'Share'}
    </button>
  );
}
