import Link from 'next/link';
import { BookOpen, ChevronRight, Crown, Headphones, Download, Sparkles, Globe2, Feather, PenLine } from 'lucide-react';
import { LANGS, getStories } from '../lib/naija';
import HeroMarquee, { type MarqueeItem } from './components/HeroMarquee';
import { getPublishedNovels, langName } from '../lib/novels';
import { AUDIENCES, forAudience, getCatalogue, getGenres, getGenre, type Book } from '../lib/booknest';
import Rail from './components/Rail';
import BookCover from './components/BookCover';
import ContinueReading from './components/ContinueReading';
import SponsorSlot from './components/SponsorSlot';
import ShareAppButton from './components/ShareAppButton';
import SaveBookButton from './components/SaveBookButton';
import Footer from './components/Footer';

export const revalidate = 300;

function bySlugs(books: Book[], slugs: string[]) {
  return books.filter(b => slugs.includes(getGenre(b)?.slug ?? ''));
}

/** Small seeded shuffle so the cover wall changes every day but stays stable within a day. */
function dailyShuffle<T>(items: T[], salt: number): T[] {
  let seed = (Math.floor((Date.now() + 3600_000) / 86_400_000) * 7919 + salt) >>> 0;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const LANG_TAG: Record<string, string> = { yo: 'Yorùbá', ha: 'Hausa', ig: 'Igbo', pcm: 'Pidgin', enu: 'Enuani', en: 'English' };

export default async function Home() {
  const [books, genres, novels, stories] = await Promise.all([getCatalogue(), getGenres(), getPublishedNovels({ limit: 16 }), getStories().catch(() => [])]);
  const featured = books.filter(b => b.is_featured);
  // Cover wall: Naija-language storybooks, Nigerian & African books, new Naija novels and world classics, woven together.
  const naijaStories: MarqueeItem[] = dailyShuffle(stories.filter(st => st.cover_url), 1).map(st => ({
    key: `s-${st.id}`, href: `/naija/story/${st.id}`, title: st.title, cover: st.cover_url, tag: LANG_TAG[st.lang] ?? st.lang, picture: true, lang: st.lang,
  }));
  const african: MarqueeItem[] = dailyShuffle(bySlugs(books, ['african-literature']), 2).map(b => ({
    key: `b-${b.id}`, href: `/book/${b.id}`, title: b.title, author: b.author, cover: b.cover_url, tag: /nigeria|igbo|housa|hausa|yoruba|equiano/i.test(`${b.title} ${b.author}`) ? 'Nigerian' : 'African',
  }));
  const fresh: MarqueeItem[] = novels.map(n => ({
    key: `n-${n.id}`, href: `/novel/${n.id}`, title: n.title, author: n.booknest_authors?.pen_name, cover: n.cover_url, tag: `${LANG_TAG[n.language] ?? ''} novel`.trim(),
  }));
  const used = new Set(african.map(a => a.key));
  const world: MarqueeItem[] = dailyShuffle(featured, 3).filter(b => !used.has(`b-${b.id}`)).map(b => ({
    key: `b-${b.id}`, href: `/book/${b.id}`, title: b.title, author: b.author, cover: b.cover_url, tag: getGenre(b)?.name ?? 'Classic',
  }));
  const local = [...fresh, ...african];
  const woven: MarqueeItem[] = [];
  const seen = new Set<string>();
  for (let i = 0; woven.length < 36 && (i < naijaStories.length || i < local.length || i < world.length * 2); i += 1) {
    for (const item of [naijaStories[i], local[i], world[i * 2], world[i * 2 + 1]]) {
      if (item && !seen.has(item.key) && woven.length < 36) { seen.add(item.key); woven.push(item); }
    }
  }
  // Alternate which row starts each group of four, so both rows mix storybooks, Nigerian books and classics.
  const marqueeRows = [woven.filter((_, i) => (i + Math.floor(i / 4)) % 2 === 0), woven.filter((_, i) => (i + Math.floor(i / 4)) % 2 === 1)];

  const rails: { title: string; kicker: string; href: string; slugs: string[] }[] = [
    { title: 'Mystery & suspense', kicker: 'PAGE-TURNERS', href: '/genre/mystery', slugs: ['mystery'] },
    { title: 'Epic adventures', kicker: 'ADVENTURE', href: '/genre/adventure', slugs: ['adventure'] },
    { title: 'Love stories', kicker: 'ROMANCE', href: '/genre/romance', slugs: ['romance'] },
    { title: 'Worlds beyond ours', kicker: 'SCI-FI & FANTASY', href: '/genre/science-fiction', slugs: ['science-fiction', 'fantasy'] },
    { title: 'Money, power & strategy', kicker: 'BUSINESS', href: '/genre/business', slugs: ['business', 'finance'] },
    { title: 'Level up your life', kicker: 'SELF-GROWTH', href: '/genre/self-growth', slugs: ['self-growth'] },
    { title: 'For young readers', kicker: 'CHILDREN', href: '/genre/children', slugs: ['children'] },
    { title: 'After dark', kicker: 'HORROR & GOTHIC', href: '/genre/horror', slugs: ['horror'] },
    { title: 'Mind, faith & wisdom', kicker: 'PHILOSOPHY', href: '/genre/psychology', slugs: ['psychology', 'religion', 'education'] },
    { title: 'History that shaped us', kicker: 'HISTORY', href: '/genre/history', slugs: ['history'] },
  ];

  return (
    <main className="home">
      <section className="hero heroWall">
        <div className="heroGlow" aria-hidden />
        <div className="heroCopy">
          <span className="kicker"><Sparkles size={14} /> HAUSA · YORÙBÁ · IGBO · PIDGIN · ENUANI · THE WORLD&apos;S CLASSICS</span>
          <h1>Read Nigeria. Read the world.</h1>
          <p className="heroBlurb">Thousands of free books, storybooks in your mother tongue, and new novels by Nigerian writers. One beautiful reader on your phone.</p>
          <div className="heroCtas">
            <Link className="btn btnGold btnLg" href="/explore"><BookOpen size={18} /> Start reading</Link>
            <Link className="btn btnGhost btnLg" href="/naija">Naija Languages</Link>
          </div>
          <form className="heroSearch" action="/explore" method="get" role="search">
            <input name="q" placeholder="Search titles, authors, topics…" aria-label="Search books" />
            <button type="submit">Search</button>
          </form>
        </div>
        {woven.length > 0 && <HeroMarquee rows={marqueeRows} />}
      </section>

      <ContinueReading />

      <nav className="chipRow" aria-label="Genres">
        {genres.map(g => <Link key={g.id} href={`/genre/${g.slug}`} className="chip"><span>{g.icon}</span>{g.name}</Link>)}
      </nav>

      <section className="genz">
        <Rail title="Gen Z picks" kicker="🔥 FOR TEENS & YOUNG READERS" subtitle="Dark romance, heists, monsters and plot twists — the classics that started it all."
          href="/explore?for=teens" books={forAudience(books, 'teens').filter(b => b.vibe).slice(0, 18)} vibes />
      </section>

      <Rail title="Trending on M King Reads" kicker="TOP PICKS" href="/explore" books={featured.slice(0, 12)} ranked />

      <SponsorSlot />

      <section className="whoReads" aria-label="Books for every reader">
        <div className="railHead"><div><span className="kicker">FOR EVERY READER</span><h2>Who&apos;s reading today?</h2></div></div>
        <div className="whoGrid">
          {AUDIENCES.map(a => (
            <Link key={a.id} href={`/explore?for=${a.id}`} className={`whoCard who-${a.id}`}>
              <span className="whoEmoji">{a.emoji}</span>
              <strong>{a.label}</strong>
              <small>{a.blurb}</small>
              <em>{forAudience(books, a.id).length} books <ChevronRight size={14} /></em>
            </Link>
          ))}
        </div>
      </section>

      <section className="naijaBand">
        <div>
          <span className="kicker"><span className="ng" /> NEW · NAIJA LANGUAGES</span>
          <h2>Read and speak Yorùbá, Hausa, Igbo, Pidgin &amp; Enuani</h2>
          <p>Picture storybooks in your mother tongue, audio lessons from native speakers, everyday phrases and the Enuani dictionary.</p>
        </div>
        <div className="naijaChips">
          {LANGS.map(l => <Link key={l.code} href={`/naija/${l.code}`} style={{ borderColor: l.tint }}><strong>{l.name}</strong><small style={{ color: l.tint }}>{l.hello}</small></Link>)}
        </div>
      </section>

      {novels.length > 0 ? (
        <section className="rail">
          <div className="railHead"><div><span className="sectionKicker"><Feather size={13} /> NEW NAIJA NOVELS</span><h2>Fresh from Nigerian writers</h2></div><Link className="railMore" href="/novels">See all <ChevronRight size={15} /></Link></div>
          <div className="railTrack">
            {novels.map(n => (
              <Link key={n.id} href={`/novel/${n.id}`} className="tile"><div className="tileCoverWrap"><BookCover src={n.cover_url} title={n.title} author={n.booknest_authors?.pen_name} /></div>
                <div className="tileText"><strong>{n.title}</strong><span>{n.booknest_authors?.pen_name}</span><em>{langName(n.language)}</em></div></Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="card writeCta">
        <div><span className="kicker"><Feather size={13} /> FOR WRITERS</span><h3>Write in Yorùbá, Hausa, Igbo, Pidgin or Enuani? Get paid for it.</h3>
          <p className="dim">Publish your novel chapter by chapter. Readers unlock it, and you keep most of every sale.</p></div>
        <Link className="btn btnGold" href="/write"><PenLine size={16} /> Publish your novel</Link>
      </section>

      <ShareAppButton variant="card" />

      <section className="africa">
        <div className="africaCopy">
          <span className="kicker"><Globe2 size={14} /> FROM OUR CONTINENT</span>
          <h2>Stories from Africa</h2>
          <p>Voices, journeys and histories from across the continent — the collection grows every month.</p>
          <Link className="btn btnGold" href="/genre/african-literature">Explore African literature <ChevronRight size={16} /></Link>
        </div>
        <div className="railTrack">
          {bySlugs(books, ['african-literature']).map(b => (
            <Link key={b.id} href={`/book/${b.id}`} className="tile"><div className="tileCoverWrap"><BookCover src={b.cover_url} title={b.title} author={b.author} /></div><div className="tileText"><strong>{b.title}</strong><span>{b.author}</span></div></Link>
          ))}
        </div>
      </section>

      {rails.slice(0, 3).map(r => <Rail key={r.title} title={r.title} kicker={r.kicker} href={r.href} books={bySlugs(books, r.slugs).slice(0, 14)} />)}

      <section className="plusBand">
        <div>
          <span className="kicker"><Crown size={14} /> M KING READS PLUS</span>
          <h2>Read more. Pay less than a plate of jollof.</h2>
          <ul>
            <li><Download size={16} /> Download books, read with zero data</li>
            <li><Headphones size={16} /> Read-Aloud: listen while you commute</li>
            <li><Sparkles size={16} /> No ads, premium themes & reading stats</li>
          </ul>
        </div>
        <Link className="btn btnGold btnLg" href="/premium">Try Plus <ChevronRight size={17} /></Link>
      </section>

      {rails.slice(3).map(r => <Rail key={r.title} title={r.title} kicker={r.kicker} href={r.href} books={bySlugs(books, r.slugs).slice(0, 14)} />)}

      <SponsorSlot variant="inline" />

      <Rail title="The great classics" kicker="TIMELESS" href="/genre/classics" books={bySlugs(books, ['classics', 'poetry']).slice(0, 16)} />

      <section className="openShelf">
        <div className="openShelfArt" aria-hidden><span>70k</span></div>
        <div>
          <span className="kicker">OPEN COLLECTION</span>
          <h2>70,000+ more free books</h2>
          <p>Search the full Project Gutenberg collection and read any edition right here in M King Reads.</p>
          <Link className="btn btnGhost" href="/free-books">Browse the open collection <ChevronRight size={16} /></Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
