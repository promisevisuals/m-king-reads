/**
 * Popular modern authors and books we can't offer free (still under copyright), mapped to
 * the shelves their readers enjoy. Used when a search finds nothing in the catalogue.
 */
export type Lookalike = { name: string; kind: 'author' | 'book'; genres: string[]; pitch: string };

const ENTRIES: (Lookalike & { match: string[] })[] = [
  { name: 'Dan Brown', kind: 'author', match: ['dan brown', 'danbrown', 'da vinci code', 'davinci code', 'angels and demons', 'angels & demons', 'digital fortress', 'deception point', 'the lost symbol'], genres: ['thriller', 'mystery'], pitch: 'codes, secret societies and races against time' },
  { name: 'Robert Ludlum', kind: 'author', match: ['ludlum', 'bourne', 'born identity'], genres: ['thriller', 'adventure'], pitch: 'spies, false identities and men on the run' },
  { name: 'Tom Clancy', kind: 'author', match: ['clancy', 'jack ryan', 'hunt for red october'], genres: ['thriller', 'science-fiction'], pitch: 'spies, secret missions and high-tech warfare' },
  { name: 'Frederick Forsyth', kind: 'author', match: ['frederick forsyth', 'day of the jackal', 'odessa file', 'dogs of war'], genres: ['thriller'], pitch: 'assassins, agents and political plots' },
  { name: 'John le Carré', kind: 'author', match: ['le carre', 'le carré', 'tinker tailor', 'george smiley'], genres: ['thriller'], pitch: 'quiet, clever spy stories' },
  { name: 'Ian Fleming', kind: 'author', match: ['ian fleming', 'james bond', '007', 'casino royale'], genres: ['thriller', 'adventure'], pitch: 'secret agents and daring missions' },
  { name: 'Lee Child', kind: 'author', match: ['lee child', 'jack reacher', 'reacher'], genres: ['thriller', 'adventure'], pitch: 'lone heroes and fast action' },
  { name: 'James Patterson', kind: 'author', match: ['james patterson', 'alex cross'], genres: ['thriller', 'mystery'], pitch: 'detectives and page-turning crime' },
  { name: 'John Grisham', kind: 'author', match: ['grisham', 'the firm', 'pelican brief', 'a time to kill'], genres: ['thriller', 'mystery'], pitch: 'conspiracies, secrets and courtroom twists' },
  { name: 'Sidney Sheldon', kind: 'author', match: ['sidney sheldon', 'if tomorrow comes', 'rage of angels'], genres: ['thriller', 'romance'], pitch: 'glamour, revenge and twisty plots' },
  { name: 'Jeffrey Archer', kind: 'author', match: ['jeffrey archer', 'kane and abel'], genres: ['thriller', 'classics'], pitch: 'rivalry, ambition and revenge' },
  { name: 'Ken Follett', kind: 'author', match: ['follett', 'pillars of the earth', 'eye of the needle'], genres: ['thriller', 'history'], pitch: 'spies, history and epic drama' },
  { name: 'Agatha Christie', kind: 'author', match: ['agatha christie', 'christie', 'poirot', 'miss marple', 'murder on the orient express'], genres: ['mystery', 'thriller'], pitch: 'clever detectives and puzzling murders' },
  { name: 'Michael Crichton', kind: 'author', match: ['crichton', 'jurassic park', 'andromeda strain'], genres: ['science-fiction', 'adventure'], pitch: 'science gone wrong and techno-thrills' },
  { name: 'Isaac Asimov', kind: 'author', match: ['asimov', 'i, robot'], genres: ['science-fiction', 'science-tech'], pitch: 'big ideas about the future' },
  { name: 'Arthur C. Clarke', kind: 'author', match: ['arthur c. clarke', 'arthur clarke', 'space odyssey', 'rendezvous with rama'], genres: ['science-fiction', 'science-tech'], pitch: 'space, science and wonder' },
  { name: 'Frank Herbert', kind: 'author', match: ['frank herbert', 'dune'], genres: ['science-fiction', 'fantasy'], pitch: 'epic worlds beyond Earth' },
  { name: 'Andy Weir', kind: 'author', match: ['andy weir', 'the martian', 'project hail mary'], genres: ['science-fiction', 'science-tech'], pitch: 'survival in space with real science' },
  { name: 'Stephen King', kind: 'author', match: ['stephen king', 'the shining', 'pet sematary'], genres: ['horror', 'thriller'], pitch: 'chills and dark mysteries' },
  { name: 'Chinua Achebe', kind: 'author', match: ['achebe', 'things fall apart', 'arrow of god', 'no longer at ease'], genres: ['african-literature', 'classics'], pitch: 'great African storytelling' },
  { name: 'Chimamanda Ngozi Adichie', kind: 'author', match: ['adichie', 'chimamanda', 'half of a yellow sun', 'purple hibiscus', 'americanah'], genres: ['african-literature', 'romance'], pitch: 'powerful Nigerian stories' },
];

export function findLookalike(query: string): Lookalike | null {
  const q = ` ${query.toLowerCase().replace(/\s+/g, ' ').trim()} `;
  if (q.trim().length < 3) return null;
  for (const e of ENTRIES) {
    if (e.match.some(m => q.includes(m.length <= 4 ? ` ${m.trim()} ` : m))) {
      const { match: _match, ...rest } = e;
      void _match;
      return rest;
    }
  }
  return null;
}
