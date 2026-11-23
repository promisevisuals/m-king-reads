'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Crown, Flame, HeartHandshake, LibraryBig, LogOut, Megaphone, MessageSquarePlus, NotebookPen, PenLine, Settings, Shield, Target, Timer } from 'lucide-react';
import { supabase } from '../../lib/supabase-browser';
import { signOutAndRelease } from '../../lib/deviceLock';
import { useAccount } from '../../lib/account';
import { naira } from '../../lib/format';
import ShareAppButton from '../components/ShareAppButton';
import Footer from '../components/Footer';

type Day = { day: string; seconds: number };
type Payment = { id: string; kind: string; amount: number; status: string; created_at: string; billing_period: string | null };

function isoDay(d: Date) { return d.toISOString().slice(0, 10); }

export default function ProfilePage() {
  const { user, plus, sub, ready } = useAccount();
  const [days, setDays] = useState<Day[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [lib, setLib] = useState({ saved: 0, progress: 0, completed: 0 });
  const [admin, setAdmin] = useState(false);
  const [goal, setGoal] = useState(20);

  useEffect(() => {
    if (!ready) return;
    if (!user) { window.location.href = '/login?next=/profile'; return; }
    try { setGoal(Number(localStorage.getItem('mkr-daily-goal')) || 20); } catch {}
    const since = isoDay(new Date(Date.now() - 40 * 86400000));
    Promise.all([
      supabase.from('booknest_reading_days').select('day,seconds').gte('day', since).order('day'),
      supabase.from('booknest_payment_requests').select('id,kind,amount,status,created_at,billing_period').order('created_at', { ascending: false }).limit(10),
      supabase.from('booknest_library').select('book_id,booknest_reading_progress(progress)'),
      supabase.rpc('booknest_is_admin'),
    ]).then(([d, p, l, a]) => {
      setDays((d.data as Day[]) ?? []);
      setPayments((p.data as Payment[]) ?? []);
      const rows = (l.data ?? []).map((r: any) => Number((Array.isArray(r.booknest_reading_progress) ? r.booknest_reading_progress[0] : r.booknest_reading_progress)?.progress ?? 0));
      setLib({ saved: rows.length, progress: rows.filter(v => v > 0 && v < 100).length, completed: rows.filter(v => v >= 100).length });
      setAdmin(a.data === true);
    });
  }, [ready, user]);

  const stats = useMemo(() => {
    const map = new Map(days.map(d => [d.day, d.seconds]));
    let streak = 0;
    const cursor = new Date();
    if (!map.get(isoDay(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
    while (map.get(isoDay(cursor))) { streak += 1; cursor.setUTCDate(cursor.getUTCDate() - 1); }
    const span = plus ? 30 : 7;
    const chart = Array.from({ length: span }, (_, i) => {
      const d = new Date(Date.now() - (span - 1 - i) * 86400000);
      return { day: isoDay(d), label: d.toLocaleDateString('en-NG', { weekday: 'narrow' }), min: Math.round((map.get(isoDay(d)) ?? 0) / 60) };
    });
    const today = Math.round((map.get(isoDay(new Date())) ?? 0) / 60);
    const week = chart.slice(-7).reduce((s, c) => s + c.min, 0);
    return { streak, chart, today, week, max: Math.max(goal, ...chart.map(c => c.min)) };
  }, [days, plus, goal]);

  function setDailyGoal(n: number) { setGoal(n); try { localStorage.setItem('mkr-daily-goal', String(n)); } catch {} }
  async function logout() { await signOutAndRelease(); window.location.href = '/'; }

  if (!ready || !user) return <main className="page narrow"><p className="dim">Loading your account…</p></main>;

  return (
    <main className="page narrow profile">
      <section className="profileHead">
        <div className={`avatar avatarLg${plus ? ' avatarPlus' : ''}`}>{(user.email || 'M').charAt(0).toUpperCase()}</div>
        <div><h1>Hello, reader</h1><p className="dim">{user.email}</p></div>
        {plus ? <span className="pill pillGold"><Crown size={13} /> Plus</span> : <Link className="btn btnGold btnSmall" href="/premium"><Crown size={14} /> Get Plus</Link>}
      </section>

      <section className="statRow">
        <div className="stat"><Flame size={20} className="flame" /><strong>{stats.streak}</strong><span>day streak</span></div>
        <div className="stat"><Timer size={20} /><strong>{stats.today}</strong><span>min today</span></div>
        <div className="stat"><Target size={20} /><strong>{stats.week}</strong><span>min this week</span></div>
      </section>

      <section className="card">
        <div className="cardHead"><h3>Reading activity</h3><span className="dim">Last {plus ? 30 : 7} days</span></div>
        <div className="goalBar"><span>Today: {stats.today} / {goal} min</span><div className="bar"><span style={{ width: `${Math.min(100, (stats.today / goal) * 100)}%` }} /></div></div>
        <div className="chart" aria-label="Minutes read per day">
          {stats.chart.map(c => <div key={c.day} className="chartCol" title={`${c.day}: ${c.min} min`}><span style={{ height: `${Math.max(3, (c.min / stats.max) * 100)}%` }} className={c.min >= goal ? 'hit' : ''} />{!plus && <small>{c.label}</small>}</div>)}
        </div>
        <div className="setRow"><span>Daily goal</span><div className="swatches">{[10, 20, 30, 60].map(n => <button key={n} className={`swatch${goal === n ? ' on' : ''}`} onClick={() => setDailyGoal(n)}>{n} min</button>)}</div></div>
        {!plus && <p className="dim small"><Crown size={12} className="gold" /> Plus shows 30 days of history. <Link href="/premium">Upgrade</Link></p>}
      </section>

      <section className="statRow">
        <Link href="/library" className="stat"><strong>{lib.saved}</strong><span>Saved</span></Link>
        <Link href="/library" className="stat"><strong>{lib.progress}</strong><span>Reading</span></Link>
        <Link href="/library" className="stat"><strong>{lib.completed}</strong><span>Finished</span></Link>
      </section>

      <section className="card">
        <div className="cardHead"><h3>Membership</h3></div>
        {plus && sub?.expires_at ? <p>Plus is active until <strong>{new Date(sub.expires_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.</p> : <p className="dim">You&apos;re on the free plan.</p>}
        {payments.length > 0 && <ul className="payList">{payments.map(p => (
          <li key={p.id}><span>{p.kind === 'plus' ? `Plus · ${p.billing_period}` : p.kind === 'tip' ? 'Support' : 'Advert'}</span><b>{naira(p.amount)}</b><em className={`status status-${p.status}`}>{p.status === 'pending' ? 'Awaiting confirmation' : p.status}</em></li>
        ))}</ul>}
        <Link className="btn btnGhost" href="/premium">{plus ? 'Extend Plus' : 'See Plus plans'}</Link>
      </section>

      <nav className="menuList">
        <Link href="/library"><LibraryBig size={18} /> My library</Link>
        <Link href="/bookmarks"><Bookmark size={18} /> Bookmarks</Link>
        <Link href="/suggest-book"><MessageSquarePlus size={18} /> Suggest a book</Link>
        <Link href="/my-suggestions"><Settings size={18} /> My suggestions</Link>
        <ShareAppButton variant="menu" />
        <Link href="/support"><HeartHandshake size={18} /> Support M King Reads</Link>
        <Link href="/advertise"><Megaphone size={18} /> Advertise with us</Link>
        <Link href="/notes" className="adminLink"><NotebookPen size={18} /> My notes</Link>
        <Link href="/write" className="adminLink"><PenLine size={18} /> Writer Studio — publish a novel</Link>
        {admin && <Link href="/admin" className="adminLink"><Shield size={18} /> Admin dashboard</Link>}
        <button onClick={logout}><LogOut size={18} /> Log out</button>
      </nav>
      <Footer />
    </main>
  );
}
