'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, Heart, MessageCircle, Send, Share2, ThumbsUp, X } from 'lucide-react';

export const APP_URL = 'https://mkingreads.promisevisuals.com';

/** A few warm invitations; one is picked each time so repeat shares feel fresh. */
const MESSAGES = [
  "📚 I've found my new favourite reading spot! M King Reads has thousands of free books, storybooks in our mother tongues and fresh Naija novels — all in one beautiful reader on your phone. Come read with me! ✨",
  '✨ Book lovers, this one is for you! M King Reads lets you read thousands of books free, keeps your place, reads aloud and even works offline. Grab a book and join me 📖💛',
  '👑 Read Nigeria. Read the world. M King Reads is a free library in your pocket — timeless classics, African stories and new Naija novels. You go love am! 📚',
];

const pick = () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
const fullText = (message: string) => `${message}\n\n👉 ${APP_URL}`;

type Variant = 'icon' | 'menu' | 'card';

/**
 * "Share M King Reads" — opens the phone's share sheet with a short, warm message and the link.
 * Where the share sheet isn't available (most laptops) it shows WhatsApp, Facebook, X and Copy.
 */
export default function ShareAppButton({ variant = 'icon' }: { variant?: Variant }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [thanks, setThanks] = useState(false);

  async function share() {
    const next = pick();
    setMessage(next);
    setThanks(false);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'M King Reads — free books, beautifully read', text: next, url: APP_URL });
        setThanks(true);
        return;
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') return;
      }
    }
    setOpen(true);
  }

  return (
    <>
      {variant === 'icon' && (
        <button type="button" className="iconBtn" onClick={share} aria-label="Share M King Reads" title="Share M King Reads"><Share2 size={19} /></button>
      )}
      {variant === 'menu' && (
        <button type="button" onClick={share}><Share2 size={18} /> Share M King Reads with friends</button>
      )}
      {variant === 'card' && (
        <section className="card shareAppCard">
          <div>
            <span className="kicker"><Heart size={13} /> SPREAD THE LOVE</span>
            <h2>Know someone who loves a good book?</h2>
            <p className="dim">Send them M King Reads — thousands of free books on their phone, with a sweet note from you.</p>
            {thanks && <p className="small gold" role="status">Thank you for sharing! 💛</p>}
          </div>
          <button type="button" className="btn btnGold btnLg" onClick={share}><Share2 size={18} /> Share M King Reads</button>
        </section>
      )}
      {/* Portal: the header uses a backdrop blur, which would trap a fixed-position sheet inside it. */}
      {open && createPortal(<ShareSheet message={message} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

function ShareSheet({ message, onClose }: { message: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const text = fullText(message);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch {}
  }

  const links = [
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(text)}` },
    { label: 'Facebook', icon: ThumbsUp, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}&quote=${encodeURIComponent(message)}` },
    { label: 'X', icon: Send, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(APP_URL)}` },
  ];

  return (
    <div className="modalBack" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Share M King Reads" onClick={e => e.stopPropagation()}>
        <button className="modalClose" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <h3><Share2 size={20} className="gold" /> Share M King Reads</h3>
        <p>Your message is ready — pick where to send it.</p>
        <p className="shareAppPreview">{text}</p>
        <div className="shareAppLinks">
          {links.map(({ label, icon: Icon, href }) => (
            <a key={label} className="btn btnGhost" href={href} target="_blank" rel="noreferrer"><Icon size={16} /> {label}</a>
          ))}
        </div>
        <button className="btn btnGold btnBlock" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied! Paste it anywhere' : 'Copy message and link'}</button>
      </div>
    </div>
  );
}
