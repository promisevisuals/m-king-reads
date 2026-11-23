'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Crown, Home, LibraryBig, Search, UserRound } from 'lucide-react';
import { useAccount } from '../../lib/account';
import Logo from './Logo';
import ShareAppButton from './ShareAppButton';

const TABS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/library', label: 'Library', icon: LibraryBig },
  { href: '/premium', label: 'Plus', icon: Crown },
  { href: '/profile', label: 'Me', icon: UserRound },
];

function isActive(path: string, href: string) {
  return href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
}

export default function AppNav() {
  const path = usePathname() || '/';
  const { user, plus } = useAccount();
  if (path.startsWith('/naija/story/') || path.startsWith('/read/') || /^\/free-books\/[^/]+\/read/.test(path)) return null;

  return (
    <>
      <header className="appBar">
        <Link href="/" className="appBrand" aria-label="M King Reads home"><Logo /><span>M King <b>Reads</b></span></Link>
        <nav className="appLinks" aria-label="Main">
          {TABS.slice(0, 4).map(t => <Link key={t.href} href={t.href} className={isActive(path, t.href) ? 'on' : ''}>{t.label === 'Plus' ? 'Plus' : t.label}</Link>)}
          <Link href="/naija" className={isActive(path, '/naija') ? 'on' : ''}>Naija Languages</Link>
          <Link href="/novels" className={isActive(path, '/novel') ? 'on' : ''}>Novels</Link>
          <Link href="/free-books" className={isActive(path, '/free-books') ? 'on' : ''}>70,000+ Free</Link>
        </nav>
        <div className="appActions">
          <ShareAppButton />
          <Link href="/explore" className="iconBtn" aria-label="Search"><Search size={19} /></Link>
          {user ? (
            <Link href="/profile" className={`avatar${plus ? ' avatarPlus' : ''}`} aria-label="Your account">
              {(user.email || 'M').charAt(0).toUpperCase()}
              {plus && <Crown size={11} className="avatarCrown" />}
            </Link>
          ) : (
            <Link href="/login" className="btn btnSmall">Sign in</Link>
          )}
        </div>
      </header>
      <nav className="tabBar" aria-label="App tabs">
        {TABS.map(t => {
          const Icon = t.icon;
          const on = isActive(path, t.href);
          return (
            <Link key={t.href} href={t.href === '/profile' && !user ? '/login' : t.href} className={`${on ? 'on' : ''}${t.href === '/premium' ? ' tabPlus' : ''}`}>
              <Icon size={21} strokeWidth={on ? 2.4 : 1.8} />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
