-- More books for readers who love modern thrillers (Dan Brown, Robert Ludlum) and science fiction.
-- Public-domain titles only: every author died before 1956, so the books are free in Nigeria
-- (life + 70 years) as well as in the US. Additive: one new genre and new catalogue rows.

insert into public.booknest_genres (name, slug, icon)
select 'Thrillers & Spies', 'thriller', '🕵️'
where not exists (select 1 from public.booknest_genres where slug = 'thriller');

with g as (select id, slug from public.booknest_genres),
rows (gid, title, author, year, slug, audience, vibe, description, featured) as (values
  -- Thrillers & spies: codes, conspiracies, secret societies, men on the run
  (2360, 'The Riddle of the Sands', 'Erskine Childers', 1903, 'thriller', array['young-adult','grown-ups'], 'Sailing into a secret invasion plan ⛵', 'Two friends sailing the North Sea stumble on a hidden plot against Britain — the novel that invented the modern spy thriller.', true),
  (559, 'Greenmantle', 'John Buchan', 1916, 'thriller', array['young-adult','grown-ups'], 'Undercover across a world at war 🌍', 'Richard Hannay goes undercover across wartime Europe to stop a prophecy that could set the East on fire.', true),
  (560, 'Mr. Standfast', 'John Buchan', 1919, 'thriller', array['young-adult','grown-ups'], 'Hunting the master spy 🎯', 'Hannay hunts a brilliant enemy agent hiding in plain sight, from Scottish hills to the Alps.', false),
  (57631, 'The Power-House', 'John Buchan', 1913, 'thriller', array['young-adult','grown-ups'], 'Secret society, ordinary hero 🗝️', 'A London lawyer uncovers a secret organisation that plans to bring down civilisation from the shadows.', false),
  (974, 'The Secret Agent', 'Joseph Conrad', 1907, 'thriller', array['grown-ups'], 'Double agents in old London 💣', 'A shopkeeper who secretly works for a foreign embassy is pushed into a bombing plot with tragic results.', false),
  (2480, 'Under Western Eyes', 'Joseph Conrad', 1911, 'thriller', array['grown-ups'], 'Betrayal, revolution, a spy''s conscience 🕯️', 'A student in Tsarist Russia is drawn into an assassination and a dangerous game of informers and revolutionaries.', false),
  (5815, 'The Great Impersonation', 'E. Phillips Oppenheim', 1920, 'thriller', array['young-adult','grown-ups'], 'Who is he really? 🎭', 'An English aristocrat returns from Africa — or is he a German agent wearing his face? A classic identity thriller.', true),
  (15302, 'The Man With the Clubfoot', 'Valentine Williams', 1918, 'thriller', array['young-adult','grown-ups'], 'Behind enemy lines 🧳', 'A British officer slips into Germany disguised as an American and faces the Kaiser''s most feared spymaster.', false),
  (583, 'The Woman in White', 'Wilkie Collins', 1859, 'thriller', array['young-adult','grown-ups'], 'Secrets, swaps & a midnight stranger 🌙', 'A chance meeting with a mysterious woman on a moonlit road opens a conspiracy of stolen identity and fortune.', true),
  (155, 'The Moonstone', 'Wilkie Collins', 1868, 'thriller', array['young-adult','grown-ups'], 'A cursed diamond vanishes 💎', 'A sacred Indian diamond disappears on a birthday night — the first great detective novel in English.', false),
  (28164, 'The Big Bow Mystery', 'Israel Zangwill', 1891, 'thriller', array['young-adult','grown-ups'], 'Locked room, no way in 🔒', 'A man is found dead in a room locked from the inside. A short, clever puzzle that started a whole genre.', false),
  (4047, 'The Leavenworth Case', 'Anna Katharine Green', 1878, 'thriller', array['young-adult','grown-ups'], 'Millionaire murdered at his desk 🖋️', 'A rich New Yorker is shot in his locked library, and every clue points to one of his two nieces.', false),
  (9845, 'The Spy', 'James Fenimore Cooper', 1821, 'thriller', array['young-adult','grown-ups'], 'Hero or traitor? 🗺️', 'A peddler during the American Revolution is suspected by both sides — but whose side is he really on?', false),
  (2226, 'Kim', 'Rudyard Kipling', 1901, 'thriller', array['teens','young-adult','grown-ups'], 'Street kid joins the Great Game 🧭', 'An orphan on the streets of Lahore is recruited into the secret spy war between empires.', false),
  (1685, 'The Mystery of the Yellow Room', 'Gaston Leroux', 1907, 'thriller', array['young-adult','grown-ups'], 'Impossible crime, teenage detective 🟨', 'A young reporter solves an attack in a sealed room that should have been impossible.', false),
  (204, 'The Innocence of Father Brown', 'G. K. Chesterton', 1911, 'thriller', array['young-adult','grown-ups'], 'Quiet priest, sharpest mind ✝️', 'A gentle little priest solves baffling crimes by understanding how criminals think.', false),
  (42, 'The Strange Case of Dr. Jekyll and Mr. Hyde', 'Robert Louis Stevenson', 1886, 'thriller', array['teens','young-adult','grown-ups'], 'One man, two faces 🧪', 'A respected doctor''s experiment unleashes the monster inside him. Short, dark and unforgettable.', false),

  -- Science fiction: the classics behind the films
  (775, 'When the Sleeper Wakes', 'H. G. Wells', 1899, 'science-fiction', array['young-adult','grown-ups'], 'Wakes up owning the world 😴', 'A man sleeps for 200 years and wakes to find he legally owns half the planet — and everyone wants to control him.', false),
  (780, 'The War in the Air', 'H. G. Wells', 1908, 'science-fiction', array['young-adult','grown-ups'], 'Airships go to war ✈️', 'Written before planes went to war, Wells imagines fleets of airships bringing down the world''s great cities.', false),
  (83, 'From the Earth to the Moon', 'Jules Verne', 1865, 'science-fiction', array['teens','young-adult'], 'Shoot for the Moon 🚀', 'A club of gun-makers builds a giant cannon to fire three men to the Moon — a century before Apollo.', true),
  (3808, 'Robur the Conqueror', 'Jules Verne', 1886, 'science-fiction', array['teens','young-adult'], 'Kidnapped by a flying genius 🛩️', 'A mysterious inventor kidnaps his critics aboard the flying machine he says is impossible.', false),
  (64, 'The Gods of Mars', 'Edgar Rice Burroughs', 1918, 'science-fiction', array['teens','young-adult'], 'Back to Barsoom ⚔️', 'John Carter returns to Mars and exposes the false gods that rule its holy valley.', false),
  (123, 'At the Earth''s Core', 'Edgar Rice Burroughs', 1914, 'science-fiction', array['teens','young-adult'], 'A world inside our world 🌋', 'A drilling machine breaks through into Pellucidar, a hidden land of dinosaurs under the Earth''s crust.', false),
  (765, 'The Moon Pool', 'A. Merritt', 1919, 'science-fiction', array['young-adult','grown-ups'], 'Glowing portal, lost race 🌕', 'Scientists follow a shining being through a Pacific ruin into a vanished civilisation below.', false),
  (10662, 'The Night Land', 'William Hope Hodgson', 1912, 'science-fiction', array['grown-ups'], 'Last city at the end of time 🌑', 'Millions of years from now, the last humans live in one pyramid surrounded by darkness and monsters.', false),
  (19141, 'Edison''s Conquest of Mars', 'Garrett P. Serviss', 1898, 'science-fiction', array['teens','young-adult'], 'Earth strikes back 👽', 'After the Martians invade, Thomas Edison builds spaceships and ray guns to take the fight to Mars.', false),
  (1607, 'A Journey in Other Worlds', 'John Jacob Astor', 1894, 'science-fiction', array['young-adult','grown-ups'], 'Road trip to Jupiter 🪐', 'In the year 2000, explorers fly anti-gravity ships to Jupiter and Saturn.', false),
  (21970, 'The Scarlet Plague', 'Jack London', 1912, 'science-fiction', array['young-adult','grown-ups'], 'After the pandemic 🦠', 'An old man tells his wild grandsons how a plague wiped out the modern world.', false),
  (18247, 'The Last Man', 'Mary Shelley', 1826, 'science-fiction', array['grown-ups'], 'The very first end of the world 🌍', 'From the author of Frankenstein: a future plague slowly empties the Earth, leaving one survivor.', false),
  (624, 'Looking Backward: 2000–1887', 'Edward Bellamy', 1888, 'science-fiction', array['young-adult','grown-ups'], 'Sleeps in 1887, wakes in 2000 ⏰', 'A Boston man wakes in the year 2000 to find a society with no poverty — and credit cards.', false),
  (201, 'Flatland: A Romance of Many Dimensions', 'Edwin A. Abbott', 1884, 'science-fiction', array['teens','young-adult','grown-ups'], 'A square discovers 3D 🔺', 'A square living in a two-dimensional world is visited by a sphere and learns there is more to reality.', false),

  -- Science you can actually read
  (944, 'The Voyage of the Beagle', 'Charles Darwin', 1839, 'science-tech', array['young-adult','grown-ups'], 'Five years around the world 🐢', 'Darwin''s own travel diary from the voyage that led to the theory of evolution.', false),
  (2300, 'The Descent of Man', 'Charles Darwin', 1871, 'science-tech', array['grown-ups'], null, 'Darwin applies evolution to human beings — where we came from and why we are the way we are.', false),
  (33504, 'Opticks', 'Isaac Newton', 1704, 'science-tech', array['grown-ups'], 'How light really works 🌈', 'Newton''s experiments with prisms and light that changed physics.', false),
  (14474, 'The Chemical History of a Candle', 'Michael Faraday', 1861, 'science-tech', array['teens','young-adult','grown-ups'], 'All of science in one candle 🕯️', 'Six famous lectures for young people that explain chemistry and physics through a burning candle.', true),
  (33283, 'Calculus Made Easy', 'Silvanus P. Thompson', 1910, 'science-tech', array['teens','young-adult','grown-ups'], 'Maths without the fear 📐', 'The friendly classic that has helped generations finally understand calculus.', false),
  (16713, 'Amusements in Mathematics', 'Henry Ernest Dudeney', 1917, 'science-tech', array['teens','young-adult','grown-ups'], 'Puzzles for code-breakers 🧩', 'Hundreds of brain-teasers, number riddles and logic puzzles — perfect for fans of codes and ciphers.', false),
  (27635, 'The Canterbury Puzzles', 'Henry Ernest Dudeney', 1907, 'science-tech', array['teens','young-adult','grown-ups'], 'Riddles with a story 🏰', 'Tricky puzzles told as tales from Chaucer''s pilgrims, with full solutions.', false)
)
insert into public.booknest_books
  (title, author, description, cover_url, genre_id, language, publication_year, source_name, source_url, license, read_url, gutenberg_id, is_featured, audience, vibe)
select r.title, r.author, r.description,
       'https://www.gutenberg.org/cache/epub/' || r.gid || '/pg' || r.gid || '.cover.medium.jpg',
       g.id, 'English', r.year, 'Project Gutenberg', 'https://www.gutenberg.org/ebooks/' || r.gid,
       'Project Gutenberg item: verify Nigerian/local copyright status before redistribution',
       'https://www.gutenberg.org/ebooks/' || r.gid, r.gid, r.featured, r.audience, r.vibe
from rows r join g on g.slug = r.slug
where not exists (select 1 from public.booknest_books b where b.gutenberg_id = r.gid);
