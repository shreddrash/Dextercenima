import type {
  CastMember,
  EpisodeItem,
  MediaDetail,
  MediaSummary,
  MediaType,
  PersonResult,
  SeasonDetail,
} from './types';

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10767: 'Talk',
};

const IMG_HERO_OBSIDIAN = '/src/assets/images/cinema_hero_obsidian_1795690934100.jpg';
const IMG_HERO_NOIR = '/src/assets/images/cinema_hero_noir_1795690934902.jpg';
const IMG_POSTER_COSMIC = '/src/assets/images/cinema_poster_cosmic_1795690934636.jpg';
const IMG_POSTER_ANIME = '/src/assets/images/cinema_poster_anime_1795690935670.jpg';
const IMG_POSTER_THRILLER = '/src/assets/images/cinema_poster_thriller_1795690935406.jpg';

interface VaultSeed extends MediaSummary {
  imdbId: string;
  contentRating: string;
  youtubeTrailerKey?: string;
  directors: Array<{ id: number; name: string }>;
  cast: CastMember[];
  collection?: { id: number; name: string; partIds: number[] };
}

const VAULT_SEEDS: VaultSeed[] = [
  {
    id: 693134,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt15239678',
    title: 'Dune: Part Two',
    overview:
      'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    poster: IMG_POSTER_COSMIC,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'obsidian',
    score: '8.3',
    voteCount: 5840,
    year: '2024',
    releaseDate: '2024-02-27',
    runtime: 167,
    seasons: null,
    episodes: null,
    genreIds: [878, 12],
    genres: ['Sci-Fi', 'Adventure'],
    language: 'en',
    country: 'US',
    popularity: 985,
    revenue: 714444358,
    companyIds: [174],
    directorIds: [27571],
    contentRating: 'PG-13',
    youtubeTrailerKey: 'Way9Dexny3w',
    directors: [{ id: 27571, name: 'Denis Villeneuve' }],
    cast: [
      { id: 1190668, name: 'Timothee Chalamet', character: 'Paul Atreides' },
      { id: 505710, name: 'Zendaya', character: 'Chani' },
      { id: 933238, name: 'Rebecca Ferguson', character: 'Lady Jessica' },
      { id: 16483, name: 'Javier Bardem', character: 'Stilgar' },
    ],
    collection: { id: 726871, name: 'Dune Collection', partIds: [438631, 693134] },
  },
  {
    id: 335984,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt1856101',
    title: 'Blade Runner 2049',
    overview:
      'Young Blade Runner K discovers a long-buried secret that leads him to track down former Blade Runner Rick Deckard, missing for thirty years.',
    poster: IMG_HERO_NOIR,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'noir',
    score: '7.6',
    voteCount: 13650,
    year: '2017',
    releaseDate: '2017-10-04',
    runtime: 164,
    seasons: null,
    episodes: null,
    genreIds: [878, 18, 9648],
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    language: 'en',
    country: 'US',
    popularity: 760,
    revenue: 259239658,
    companyIds: [174],
    directorIds: [27571],
    contentRating: 'R',
    youtubeTrailerKey: 'gCcx85zbxz4',
    directors: [{ id: 27571, name: 'Denis Villeneuve' }],
    cast: [
      { id: 30614, name: 'Ryan Gosling', character: 'K' },
      { id: 3, name: 'Harrison Ford', character: 'Rick Deckard' },
      { id: 224513, name: 'Ana de Armas', character: 'Joi' },
    ],
  },
  {
    id: 157336,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt0816692',
    title: 'Interstellar',
    overview:
      'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer vast cosmic distances.',
    poster: IMG_POSTER_COSMIC,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'cosmic',
    score: '8.4',
    voteCount: 35700,
    year: '2014',
    releaseDate: '2014-11-05',
    runtime: 169,
    seasons: null,
    episodes: null,
    genreIds: [12, 18, 878],
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    language: 'en',
    country: 'US',
    popularity: 920,
    revenue: 701729206,
    companyIds: [174],
    directorIds: [525],
    contentRating: 'PG-13',
    youtubeTrailerKey: 'zSWdZVtXT7E',
    directors: [{ id: 525, name: 'Christopher Nolan' }],
    cast: [
      { id: 10297, name: 'Matthew McConaughey', character: 'Cooper' },
      { id: 1813, name: 'Anne Hathaway', character: 'Brand' },
      { id: 83002, name: 'Jessica Chastain', character: 'Murph' },
    ],
  },
  {
    id: 27205,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt1375666',
    title: 'Inception',
    overview:
      'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered impossible.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'noir',
    score: '8.4',
    voteCount: 36500,
    year: '2010',
    releaseDate: '2010-07-15',
    runtime: 148,
    seasons: null,
    episodes: null,
    genreIds: [28, 878, 12, 53],
    genres: ['Action', 'Sci-Fi', 'Adventure', 'Thriller'],
    language: 'en',
    country: 'US',
    popularity: 880,
    revenue: 825532764,
    companyIds: [174],
    directorIds: [525],
    contentRating: 'PG-13',
    youtubeTrailerKey: 'YoHD9XEInc0',
    directors: [{ id: 525, name: 'Christopher Nolan' }],
    cast: [
      { id: 6193, name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
      { id: 24045, name: 'Joseph Gordon-Levitt', character: 'Arthur' },
      { id: 2524, name: 'Tom Hardy', character: 'Eames' },
    ],
  },
  {
    id: 155,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt0468569',
    title: 'The Dark Knight',
    overview:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, he sets out to dismantle the remaining criminal organizations.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'thriller',
    score: '8.5',
    voteCount: 32800,
    year: '2008',
    releaseDate: '2008-07-16',
    runtime: 152,
    seasons: null,
    episodes: null,
    genreIds: [18, 28, 80, 53],
    genres: ['Drama', 'Action', 'Crime', 'Thriller'],
    language: 'en',
    country: 'US',
    popularity: 890,
    revenue: 1004558444,
    companyIds: [174],
    directorIds: [525],
    contentRating: 'PG-13',
    youtubeTrailerKey: 'EXeTwQWrcwY',
    directors: [{ id: 525, name: 'Christopher Nolan' }],
    cast: [
      { id: 3894, name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
      { id: 1810, name: 'Heath Ledger', character: 'Joker' },
      { id: 64, name: 'Gary Oldman', character: 'James Gordon' },
    ],
  },
  {
    id: 872585,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt15398776',
    title: 'Oppenheimer',
    overview:
      'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    poster: IMG_POSTER_COSMIC,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'obsidian',
    score: '8.1',
    voteCount: 9400,
    year: '2023',
    releaseDate: '2023-07-19',
    runtime: 181,
    seasons: null,
    episodes: null,
    genreIds: [18, 36],
    genres: ['Drama', 'History'],
    language: 'en',
    country: 'US',
    popularity: 840,
    revenue: 952000000,
    companyIds: [33],
    directorIds: [525],
    contentRating: 'R',
    youtubeTrailerKey: 'uYPbbksJxIg',
    directors: [{ id: 525, name: 'Christopher Nolan' }],
    cast: [
      { id: 2037, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer' },
      { id: 5081, name: 'Emily Blunt', character: 'Kitty Oppenheimer' },
      { id: 3223, name: 'Robert Downey Jr.', character: 'Lewis Strauss' },
    ],
  },
  {
    id: 414906,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt1877830',
    title: 'The Batman',
    overview:
      'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'thriller',
    score: '7.7',
    voteCount: 10300,
    year: '2022',
    releaseDate: '2022-03-01',
    runtime: 176,
    seasons: null,
    episodes: null,
    genreIds: [80, 9648, 53],
    genres: ['Crime', 'Mystery', 'Thriller'],
    language: 'en',
    country: 'US',
    popularity: 775,
    revenue: 772245583,
    companyIds: [174],
    directorIds: [32278],
    contentRating: 'PG-13',
    youtubeTrailerKey: 'mqqft2x_Aa4',
    directors: [{ id: 32278, name: 'Matt Reeves' }],
    cast: [
      { id: 11288, name: 'Robert Pattinson', character: 'Bruce Wayne / The Batman' },
      { id: 37153, name: 'Zoe Kravitz', character: 'Selina Kyle' },
      { id: 17142, name: 'Paul Dano', character: 'The Riddler' },
    ],
  },
  {
    id: 603692,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt10366206',
    title: 'John Wick: Chapter 4',
    overview:
      'With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table across New York, Paris, Osaka, and Berlin.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'noir',
    score: '7.7',
    voteCount: 6450,
    year: '2023',
    releaseDate: '2023-03-22',
    runtime: 170,
    seasons: null,
    episodes: null,
    genreIds: [28, 53, 80],
    genres: ['Action', 'Thriller', 'Crime'],
    language: 'en',
    country: 'US',
    popularity: 810,
    revenue: 440146694,
    companyIds: [1632],
    directorIds: [40644],
    contentRating: 'R',
    youtubeTrailerKey: 'qEVUtrk8_B4',
    directors: [{ id: 40644, name: 'Chad Stahelski' }],
    cast: [
      { id: 6384, name: 'Keanu Reeves', character: 'John Wick' },
      { id: 1341, name: 'Donnie Yen', character: 'Caine' },
      { id: 137905, name: 'Bill Skarsgard', character: 'Marquis' },
    ],
  },
  {
    id: 569094,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt9362722',
    title: 'Spider-Man: Across the Spider-Verse',
    overview:
      'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.',
    poster: IMG_POSTER_ANIME,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'anime',
    score: '8.4',
    voteCount: 7050,
    year: '2023',
    releaseDate: '2023-05-31',
    runtime: 140,
    seasons: null,
    episodes: null,
    genreIds: [16, 28, 12, 878],
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    language: 'en',
    country: 'US',
    popularity: 865,
    revenue: 690897910,
    companyIds: [420],
    directorIds: [1001],
    contentRating: 'PG',
    youtubeTrailerKey: 'shW9i6k8cB0',
    directors: [{ id: 1001, name: 'Joaquim Dos Santos' }],
    cast: [
      { id: 587506, name: 'Shameik Moore', character: 'Miles Morales' },
      { id: 130640, name: 'Hailee Steinfeld', character: 'Gwen Stacy' },
      { id: 25072, name: 'Oscar Isaac', character: 'Miguel O’Hara' },
    ],
  },
  {
    id: 545611,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt6710474',
    title: 'Everything Everywhere All at Once',
    overview:
      'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what’s important to her by connecting with the lives she could have led in other universes.',
    poster: IMG_POSTER_COSMIC,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'cosmic',
    score: '7.8',
    voteCount: 6600,
    year: '2022',
    releaseDate: '2022-03-24',
    runtime: 139,
    seasons: null,
    episodes: null,
    genreIds: [28, 12, 878, 35],
    genres: ['Action', 'Adventure', 'Sci-Fi', 'Comedy'],
    language: 'en',
    country: 'US',
    popularity: 710,
    revenue: 143400000,
    companyIds: [41077],
    directorIds: [1383612],
    contentRating: 'R',
    youtubeTrailerKey: 'wxN1T1uxQ2g',
    directors: [{ id: 1383612, name: 'Daniel Kwan & Daniel Scheinert' }],
    cast: [
      { id: 1620, name: 'Michelle Yeoh', character: 'Evelyn Wang' },
      { id: 690, name: 'Ke Huy Quan', character: 'Waymond Wang' },
      { id: 11066, name: 'Stephanie Hsu', character: 'Joy Wang' },
    ],
  },
  {
    id: 438631,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt1160419',
    title: 'Dune',
    overview:
      'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe.',
    poster: IMG_POSTER_COSMIC,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'obsidian',
    score: '7.8',
    voteCount: 12900,
    year: '2021',
    releaseDate: '2021-09-15',
    runtime: 155,
    seasons: null,
    episodes: null,
    genreIds: [878, 12],
    genres: ['Sci-Fi', 'Adventure'],
    language: 'en',
    country: 'US',
    popularity: 790,
    revenue: 407573628,
    companyIds: [174],
    directorIds: [27571],
    contentRating: 'PG-13',
    youtubeTrailerKey: '8g18jFHCLXk',
    directors: [{ id: 27571, name: 'Denis Villeneuve' }],
    cast: [
      { id: 1190668, name: 'Timothee Chalamet', character: 'Paul Atreides' },
      { id: 933238, name: 'Rebecca Ferguson', character: 'Lady Jessica' },
    ],
    collection: { id: 726871, name: 'Dune Collection', partIds: [438631, 693134] },
  },
  {
    id: 329865,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt2543164',
    title: 'Arrival',
    overview:
      'Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace or are a threat.',
    poster: IMG_POSTER_COSMIC,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'cosmic',
    score: '7.6',
    voteCount: 17800,
    year: '2016',
    releaseDate: '2016-11-10',
    runtime: 116,
    seasons: null,
    episodes: null,
    genreIds: [18, 878, 9648],
    genres: ['Drama', 'Sci-Fi', 'Mystery'],
    language: 'en',
    country: 'US',
    popularity: 640,
    revenue: 203388186,
    companyIds: [33],
    directorIds: [27571],
    contentRating: 'PG-13',
    youtubeTrailerKey: 'tFMo3UJ4B4g',
    directors: [{ id: 27571, name: 'Denis Villeneuve' }],
    cast: [
      { id: 9273, name: 'Amy Adams', character: 'Louise Banks' },
      { id: 17604, name: 'Jeremy Renner', character: 'Ian Donnelly' },
    ],
  },
  {
    id: 299534,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt4154796',
    title: 'Avengers: Endgame',
    overview:
      'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to restore balance.',
    poster: IMG_POSTER_COSMIC,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'cosmic',
    score: '8.3',
    voteCount: 25600,
    year: '2019',
    releaseDate: '2019-04-24',
    runtime: 181,
    seasons: null,
    episodes: null,
    genreIds: [12, 878, 28],
    genres: ['Adventure', 'Sci-Fi', 'Action'],
    language: 'en',
    country: 'US',
    popularity: 850,
    revenue: 2799439100,
    companyIds: [420],
    directorIds: [19271],
    contentRating: 'PG-13',
    youtubeTrailerKey: 'TcMBFSGVi1c',
    directors: [{ id: 19271, name: 'Anthony Russo & Joe Russo' }],
    cast: [
      { id: 3223, name: 'Robert Downey Jr.', character: 'Tony Stark' },
      { id: 16828, name: 'Chris Evans', character: 'Steve Rogers' },
      { id: 1245, name: 'Scarlett Johansson', character: 'Natasha Romanoff' },
    ],
  },
  {
    id: 76341,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt1392190',
    title: 'Mad Max: Fury Road',
    overview:
      'An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken and everyone fights for the necessities of life.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'obsidian',
    score: '7.6',
    voteCount: 22400,
    year: '2015',
    releaseDate: '2015-05-13',
    runtime: 121,
    seasons: null,
    episodes: null,
    genreIds: [28, 12, 878],
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    language: 'en',
    country: 'AU',
    popularity: 680,
    revenue: 378858340,
    companyIds: [174],
    directorIds: [20629],
    contentRating: 'R',
    youtubeTrailerKey: 'hEJnMQG9ev8',
    directors: [{ id: 20629, name: 'George Miller' }],
    cast: [
      { id: 2524, name: 'Tom Hardy', character: 'Max Rockatansky' },
      { id: 6885, name: 'Charlize Theron', character: 'Imperator Furiosa' },
    ],
  },
  {
    id: 807,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt0114369',
    title: 'Se7en',
    overview:
      'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the seven deadly sins.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'thriller',
    score: '8.4',
    voteCount: 21000,
    year: '1995',
    releaseDate: '1995-09-22',
    runtime: 127,
    seasons: null,
    episodes: null,
    genreIds: [80, 9648, 53],
    genres: ['Crime', 'Mystery', 'Thriller'],
    language: 'en',
    country: 'US',
    popularity: 730,
    revenue: 327311859,
    companyIds: [174],
    directorIds: [7467],
    contentRating: 'R',
    youtubeTrailerKey: 'znmZoVkCjpI',
    directors: [{ id: 7467, name: 'David Fincher' }],
    cast: [
      { id: 287, name: 'Brad Pitt', character: 'David Mills' },
      { id: 192, name: 'Morgan Freeman', character: 'William Somerset' },
    ],
  },
  {
    id: 550,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt0137523',
    title: 'Fight Club',
    overview:
      'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'noir',
    score: '8.4',
    voteCount: 29400,
    year: '1999',
    releaseDate: '1999-10-15',
    runtime: 139,
    seasons: null,
    episodes: null,
    genreIds: [18, 53],
    genres: ['Drama', 'Thriller'],
    language: 'en',
    country: 'US',
    popularity: 795,
    revenue: 100853753,
    companyIds: [174],
    directorIds: [7467],
    contentRating: 'R',
    youtubeTrailerKey: 'qtRKdVHc-cE',
    directors: [{ id: 7467, name: 'David Fincher' }],
    cast: [
      { id: 819, name: 'Edward Norton', character: 'The Narrator' },
      { id: 287, name: 'Brad Pitt', character: 'Tyler Durden' },
    ],
  },
  {
    id: 496243,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt6751668',
    title: 'Parasite',
    overview:
      'All unemployed, Ki-taek’s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'thriller',
    score: '8.5',
    voteCount: 18300,
    year: '2019',
    releaseDate: '2019-05-30',
    runtime: 133,
    seasons: null,
    episodes: null,
    genreIds: [35, 53, 18],
    genres: ['Comedy', 'Thriller', 'Drama'],
    language: 'ko',
    country: 'KR',
    popularity: 750,
    revenue: 257591776,
    companyIds: [41077],
    directorIds: [21684],
    contentRating: 'R',
    youtubeTrailerKey: '5xH0HfJHsaY',
    directors: [{ id: 21684, name: 'Bong Joon-ho' }],
    cast: [
      { id: 20738, name: 'Song Kang-ho', character: 'Kim Ki-taek' },
      { id: 1254784, name: 'Choi Woo-shik', character: 'Kim Ki-woo' },
    ],
  },
  {
    id: 530385,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt7784604',
    title: 'Hereditary',
    overview:
      'When Ellen, the matriarch of the Graham family, passes away, her daughter’s family begins to unravel cryptic and increasingly terrifying secrets about their ancestry.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'obsidian',
    score: '7.3',
    voteCount: 7700,
    year: '2018',
    releaseDate: '2018-06-07',
    runtime: 128,
    seasons: null,
    episodes: null,
    genreIds: [27, 9648, 53],
    genres: ['Horror', 'Mystery', 'Thriller'],
    language: 'en',
    country: 'US',
    popularity: 590,
    revenue: 82800000,
    companyIds: [41077],
    directorIds: [1521576],
    contentRating: 'R',
    youtubeTrailerKey: 'V6wWKNij_1M',
    directors: [{ id: 1521576, name: 'Ari Aster' }],
    cast: [
      { id: 3051, name: 'Toni Collette', character: 'Annie Graham' },
      { id: 15009, name: 'Gabriel Byrne', character: 'Steve Graham' },
    ],
  },
  {
    id: 76203,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt1596343',
    title: 'John Wick',
    overview:
      'Ex-hitman John Wick comes out of retirement to track down the gangsters that took everything from him.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'noir',
    score: '7.4',
    voteCount: 19200,
    year: '2014',
    releaseDate: '2014-10-22',
    runtime: 101,
    seasons: null,
    episodes: null,
    genreIds: [28, 53],
    genres: ['Action', 'Thriller'],
    language: 'en',
    country: 'US',
    popularity: 710,
    revenue: 88761661,
    companyIds: [1632],
    directorIds: [40644],
    contentRating: 'R',
    youtubeTrailerKey: 'C0BMx-qxsP4',
    directors: [{ id: 40644, name: 'Chad Stahelski' }],
    cast: [{ id: 6384, name: 'Keanu Reeves', character: 'John Wick' }],
  },
  {
    id: 94605,
    mediaType: 'tv',
    category: 'anime',
    imdbId: 'tt11126994',
    title: 'Arcane',
    overview:
      'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.',
    poster: IMG_POSTER_ANIME,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'anime',
    score: '8.8',
    voteCount: 4700,
    year: '2021',
    releaseDate: '2021-11-06',
    runtime: 41,
    seasons: 2,
    episodes: 18,
    genreIds: [16, 10765, 18, 10759],
    genres: ['Animation', 'Sci-Fi & Fantasy', 'Drama', 'Action & Adventure'],
    language: 'en',
    country: 'US',
    popularity: 950,
    isLimitedSeries: false,
    contentRating: 'TV-14',
    youtubeTrailerKey: 'fXmAurh012s',
    directors: [{ id: 3001, name: 'Christian Linke & Alex Yee' }],
    cast: [
      { id: 130640, name: 'Hailee Steinfeld', character: 'Vi (voice)' },
      { id: 1397778, name: 'Ella Purnell', character: 'Jinx (voice)' },
      { id: 13240, name: 'Kevin Alejandro', character: 'Jayce (voice)' },
    ],
  },
  {
    id: 105248,
    mediaType: 'tv',
    category: 'anime',
    imdbId: 'tt12590266',
    title: 'Cyberpunk: Edgerunners',
    overview:
      'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.',
    poster: IMG_POSTER_ANIME,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'anime',
    score: '8.6',
    voteCount: 2100,
    year: '2022',
    releaseDate: '2022-09-13',
    runtime: 24,
    seasons: 1,
    episodes: 10,
    genreIds: [16, 10759, 10765],
    genres: ['Animation', 'Action & Adventure', 'Sci-Fi & Fantasy'],
    language: 'ja',
    country: 'JP',
    popularity: 830,
    isLimitedSeries: true,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'JtqIas3bYhg',
    directors: [{ id: 120780, name: 'Hiroyuki Imaishi' }],
    cast: [
      { id: 2401470, name: 'KENN', character: 'David Martinez (voice)' },
      { id: 1253008, name: 'Aoi Yuki', character: 'Lucy (voice)' },
    ],
  },
  {
    id: 127532,
    mediaType: 'tv',
    category: 'anime',
    imdbId: 'tt21209876',
    title: 'Solo Leveling',
    overview:
      'In a world where hunters must battle deadly monsters to protect humanity, Sung Jinwoo, a notoriously weak hunter, finds himself in a constant struggle for survival.',
    poster: IMG_POSTER_ANIME,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'anime',
    score: '8.5',
    voteCount: 1650,
    year: '2024',
    releaseDate: '2024-01-07',
    runtime: 24,
    seasons: 2,
    episodes: 25,
    genreIds: [16, 10759, 10765],
    genres: ['Animation', 'Action & Adventure', 'Sci-Fi & Fantasy'],
    language: 'ja',
    country: 'JP',
    popularity: 940,
    isLimitedSeries: false,
    contentRating: 'TV-14',
    youtubeTrailerKey: 'bssSj4cKsrI',
    directors: [{ id: 2145369, name: 'Shunsuke Nakashige' }],
    cast: [{ id: 1492978, name: 'Taito Ban', character: 'Sung Jinwoo (voice)' }],
  },
  {
    id: 1429,
    mediaType: 'tv',
    category: 'anime',
    imdbId: 'tt2560140',
    title: 'Attack on Titan',
    overview:
      'Many years ago, the last remnants of humanity were forced to retreat behind towering walls to escape gigantic man-eating Titans.',
    poster: IMG_POSTER_ANIME,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'anime',
    score: '8.7',
    voteCount: 6400,
    year: '2013',
    releaseDate: '2013-04-07',
    runtime: 25,
    seasons: 4,
    episodes: 89,
    genreIds: [16, 10765, 10759],
    genres: ['Animation', 'Sci-Fi & Fantasy', 'Action & Adventure'],
    language: 'ja',
    country: 'JP',
    popularity: 910,
    isLimitedSeries: false,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'MGRm4IzK1SQ',
    directors: [{ id: 121940, name: 'Tetsuro Araki' }],
    cast: [{ id: 1013495, name: 'Yuki Kaji', character: 'Eren Yeager (voice)' }],
  },
  {
    id: 95479,
    mediaType: 'tv',
    category: 'anime',
    imdbId: 'tt12343534',
    title: 'Jujutsu Kaisen',
    overview:
      'Idly indulging in baseless paranormal activities with the Occult Club, high schooler Yuji Itadori swallows a cursed talisman and becomes host to a powerful Curse.',
    poster: IMG_POSTER_ANIME,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'anime',
    score: '8.6',
    voteCount: 3650,
    year: '2020',
    releaseDate: '2020-10-03',
    runtime: 24,
    seasons: 2,
    episodes: 47,
    genreIds: [16, 10759, 10765],
    genres: ['Animation', 'Action & Adventure', 'Sci-Fi & Fantasy'],
    language: 'ja',
    country: 'JP',
    popularity: 880,
    isLimitedSeries: false,
    contentRating: 'TV-14',
    youtubeTrailerKey: 'pkKu9hLT-t8',
    directors: [{ id: 1844594, name: 'Sunghoo Park' }],
    cast: [{ id: 1563434, name: 'Junya Enoki', character: 'Yuji Itadori (voice)' }],
  },
  {
    id: 1396,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt0903747',
    title: 'Breaking Bad',
    overview:
      'Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and teams up with former student Jesse Pinkman to secure his family’s financial future.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'thriller',
    score: '8.9',
    voteCount: 14700,
    year: '2008',
    releaseDate: '2008-01-20',
    runtime: 47,
    seasons: 5,
    episodes: 62,
    genreIds: [18, 80],
    genres: ['Drama', 'Crime'],
    language: 'en',
    country: 'US',
    popularity: 960,
    isLimitedSeries: false,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'HhesaQXLuRY',
    directors: [{ id: 66633, name: 'Vince Gilligan' }],
    cast: [
      { id: 17419, name: 'Bryan Cranston', character: 'Walter White' },
      { id: 84497, name: 'Aaron Paul', character: 'Jesse Pinkman' },
    ],
  },
  {
    id: 95396,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt11280740',
    title: 'Severance',
    overview:
      'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.',
    poster: IMG_HERO_NOIR,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'noir',
    score: '8.4',
    voteCount: 1900,
    year: '2022',
    releaseDate: '2022-02-18',
    runtime: 50,
    seasons: 2,
    episodes: 19,
    genreIds: [18, 9648, 10765],
    genres: ['Drama', 'Mystery', 'Sci-Fi & Fantasy'],
    language: 'en',
    country: 'US',
    popularity: 895,
    isLimitedSeries: false,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'xEQP4VVuyrY',
    directors: [{ id: 7399, name: 'Ben Stiller' }],
    cast: [
      { id: 36801, name: 'Adam Scott', character: 'Mark Scout' },
      { id: 59175, name: 'Britt Lower', character: 'Helly Riggs' },
    ],
  },
  {
    id: 100088,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt3581920',
    title: 'The Last of Us',
    overview:
      'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.',
    poster: IMG_POSTER_COSMIC,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'obsidian',
    score: '8.6',
    voteCount: 5400,
    year: '2023',
    releaseDate: '2023-01-15',
    runtime: 59,
    seasons: 2,
    episodes: 16,
    genreIds: [18],
    genres: ['Drama', 'Sci-Fi & Fantasy'],
    language: 'en',
    country: 'US',
    popularity: 870,
    isLimitedSeries: false,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'uLtkt8BonwM',
    directors: [{ id: 35796, name: 'Craig Mazin' }],
    cast: [
      { id: 1253360, name: 'Pedro Pascal', character: 'Joel Miller' },
      { id: 1709017, name: 'Bella Ramsey', character: 'Ellie Williams' },
    ],
  },
  {
    id: 66732,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt4574334',
    title: 'Stranger Things',
    overview:
      'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
    poster: IMG_HERO_NOIR,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'noir',
    score: '8.6',
    voteCount: 17800,
    year: '2016',
    releaseDate: '2016-07-15',
    runtime: 55,
    seasons: 4,
    episodes: 34,
    genreIds: [18, 10765, 9648],
    genres: ['Drama', 'Sci-Fi & Fantasy', 'Mystery'],
    language: 'en',
    country: 'US',
    popularity: 925,
    isLimitedSeries: false,
    contentRating: 'TV-14',
    youtubeTrailerKey: 'b9EkMc79ZSU',
    directors: [{ id: 1179419, name: 'The Duffer Brothers' }],
    cast: [
      { id: 1556202, name: 'Millie Bobby Brown', character: 'Eleven' },
      { id: 1474636, name: 'Finn Wolfhard', character: 'Mike Wheeler' },
    ],
  },
  {
    id: 106379,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt12637874',
    title: 'Fallout',
    overview:
      'In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves from radiation, mutants, and bandits.',
    poster: IMG_POSTER_COSMIC,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'obsidian',
    score: '8.3',
    voteCount: 1950,
    year: '2024',
    releaseDate: '2024-04-10',
    runtime: 60,
    seasons: 1,
    episodes: 8,
    genreIds: [10759, 10765, 18],
    genres: ['Action & Adventure', 'Sci-Fi & Fantasy', 'Drama'],
    language: 'en',
    country: 'US',
    popularity: 840,
    isLimitedSeries: false,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'V-mugKDQDlg',
    directors: [{ id: 1213885, name: 'Jonathan Nolan' }],
    cast: [
      { id: 1397778, name: 'Ella Purnell', character: 'Lucy MacLean' },
      { id: 18687, name: 'Walton Goggins', character: 'The Ghoul' },
    ],
  },
  {
    id: 126308,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt2788316',
    title: 'Shogun',
    overview:
      'In Japan in the year 1600, at the dawn of a century-defining civil war, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him.',
    poster: IMG_POSTER_ANIME,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'obsidian',
    score: '8.5',
    voteCount: 1350,
    year: '2024',
    releaseDate: '2024-02-27',
    runtime: 60,
    seasons: 1,
    episodes: 10,
    genreIds: [18, 10768],
    genres: ['Drama', 'History'],
    language: 'ja',
    country: 'US',
    popularity: 820,
    isLimitedSeries: true,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'yAN5uspO_hk',
    directors: [{ id: 9001, name: 'Rachel Kondo & Justin Marks' }],
    cast: [
      { id: 9195, name: 'Hiroyuki Sanada', character: 'Lord Yoshii Toranaga' },
      { id: 1082807, name: 'Anna Sawai', character: 'Toda Mariko' },
    ],
  },
  {
    id: 87108,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt7366338',
    title: 'Chernobyl',
    overview:
      'The true story of one of the worst man-made catastrophes in history: the catastrophic nuclear accident at Chernobyl.',
    poster: IMG_POSTER_THRILLER,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'thriller',
    score: '8.7',
    voteCount: 6450,
    year: '2019',
    releaseDate: '2019-05-06',
    runtime: 65,
    seasons: 1,
    episodes: 5,
    genreIds: [18],
    genres: ['Drama', 'History'],
    language: 'en',
    country: 'US',
    popularity: 785,
    isLimitedSeries: true,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 's9APLXM9Ei8',
    directors: [{ id: 35796, name: 'Craig Mazin' }],
    cast: [
      { id: 15440, name: 'Jared Harris', character: 'Valery Legasov' },
      { id: 1640, name: 'Stellan Skarsgard', character: 'Boris Shcherbina' },
    ],
  },
  {
    id: 2316,
    mediaType: 'tv',
    category: 'show',
    imdbId: 'tt0386676',
    title: 'The Office',
    overview:
      'The everyday lives of office employees in the Scranton, Pennsylvania branch of the fictional Dunder Mifflin Paper Company.',
    poster: IMG_HERO_NOIR,
    backdrop: IMG_HERO_NOIR,
    posterTheme: 'noir',
    score: '8.6',
    voteCount: 4200,
    year: '2005',
    releaseDate: '2005-03-24',
    runtime: 22,
    seasons: 9,
    episodes: 201,
    genreIds: [35, 10764],
    genres: ['Comedy', 'Reality'],
    language: 'en',
    country: 'US',
    popularity: 790,
    isLimitedSeries: false,
    contentRating: 'TV-14',
    youtubeTrailerKey: 'LHOtME2DL4g',
    directors: [{ id: 1216630, name: 'Greg Daniels' }],
    cast: [{ id: 4495, name: 'Steve Carell', character: 'Michael Scott' }],
  },
  {
    id: 94997,
    mediaType: 'tv',
    category: 'show',
    imdbId: 'tt11198330',
    title: 'House of the Dragon',
    overview:
      'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights.',
    poster: IMG_POSTER_ANIME,
    backdrop: IMG_HERO_OBSIDIAN,
    posterTheme: 'obsidian',
    score: '8.4',
    voteCount: 5100,
    year: '2022',
    releaseDate: '2022-08-21',
    runtime: 60,
    seasons: 2,
    episodes: 18,
    genreIds: [10765, 18, 10759],
    genres: ['Sci-Fi & Fantasy', 'Drama', 'Action & Adventure'],
    language: 'en',
    country: 'US',
    popularity: 890,
    isLimitedSeries: false,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'DotnJ7tTA34',
    directors: [{ id: 1254840, name: 'Ryan Condal' }],
    cast: [
      { id: 136532, name: 'Matt Smith', character: 'Daemon Targaryen' },
      { id: 1581529, name: 'Emma D’Arcy', character: 'Rhaenyra Targaryen' },
    ],
  },
];

export function buildDefaultSeasons(seed: VaultSeed): SeasonDetail[] {
  if (seed.mediaType !== 'tv') return [];
  const totalSeasons = seed.seasons || 1;
  const totalEps = seed.episodes || 10;
  const perSeason = Math.max(4, Math.ceil(totalEps / totalSeasons));
  const result: SeasonDetail[] = [];

  for (let s = 1; s <= totalSeasons; s++) {
    const count =
      s === totalSeasons
        ? Math.max(1, totalEps - perSeason * (totalSeasons - 1))
        : perSeason;
    const episodes: EpisodeItem[] = [];
    for (let e = 1; e <= Math.min(count, 24); e++) {
      episodes.push({
        id: seed.id * 1000 + s * 100 + e,
        seasonNumber: s,
        episodeNumber: e,
        title: `Episode ${e}: ${seed.title} Chapter ${s}.${e}`,
        overview: `${seed.title} — Season ${s}, Episode ${e}. Streamed in high-definition inside Dexterx Cenima.`,
        still: seed.backdrop,
        airDate: seed.releaseDate,
        runtime: seed.runtime || 45,
      });
    }
    result.push({
      seasonNumber: s,
      title: `Season ${s}`,
      overview: `Season ${s} of ${seed.title}.`,
      episodeCount: episodes.length,
      episodes,
    });
  }
  return result;
}

export function getAllVaultItems(): MediaSummary[] {
  return VAULT_SEEDS.map(({ imdbId: _i, contentRating: _c, youtubeTrailerKey: _y, directors: _d, cast: _ca, collection: _co, ...summary }) => summary);
}

export function getHeroVaultItems(): MediaSummary[] {
  return VAULT_SEEDS.slice(0, 6).map(({ imdbId: _i, contentRating: _c, youtubeTrailerKey: _y, directors: _d, cast: _ca, collection: _co, ...summary }) => summary);
}

export function getVaultDetail(id: number, mediaType?: MediaType): MediaDetail | null {
  const found =
    VAULT_SEEDS.find((item) => item.id === id && (!mediaType || item.mediaType === mediaType)) ||
    VAULT_SEEDS.find((item) => item.id === id);
  if (!found) return null;

  const { collection: col, youtubeTrailerKey, ...rest } = found;
  const recommendations = VAULT_SEEDS.filter(
    (other) =>
      other.id !== found.id &&
      (other.mediaType === found.mediaType ||
        other.genreIds.some((g) => found.genreIds.includes(g))),
  )
    .slice(0, 10)
    .map(({ imdbId: _i, contentRating: _c, youtubeTrailerKey: _y, directors: _d, cast: _ca, collection: _co, ...summary }) => summary);

  return {
    ...rest,
    trailerEmbedUrl: youtubeTrailerKey
      ? `https://www.youtube.com/embed/${youtubeTrailerKey}?autoplay=1&rel=0`
      : undefined,
    recommendations,
    seasonsDetail: buildDefaultSeasons(found),
    collection: col
      ? {
          id: col.id,
          name: col.name,
          parts: VAULT_SEEDS.filter((p) => col.partIds.includes(p.id)).map(
            ({ imdbId: _i, contentRating: _c, youtubeTrailerKey: _y, directors: _d, cast: _ca, collection: _co, ...summary }) => summary,
          ),
        }
      : undefined,
  };
}

export function queryVaultDiscover(params: URLSearchParams): {
  list: MediaSummary[];
  page: number;
  total_pages: number;
  total_results: number;
} {
  const media = params.get('media');
  const categoryType = params.get('type');
  const withGenres = (params.get('with_genres') || params.get('genres') || '')
    .split(/[,|]/)
    .map((s) => Number(s.trim()))
    .filter((n) => n > 0);
  const withoutGenres = (params.get('without_genres') || '')
    .split(/[,|]/)
    .map((s) => Number(s.trim()))
    .filter((n) => n > 0);
  const yearMin = Number(params.get('yearMin') || (params.get('release_from') || '').slice(0, 4) || 0);
  const yearMax = Number(params.get('yearMax') || (params.get('release_to') || '').slice(0, 4) || 9999);
  const ratingMin = Number(params.get('ratingMin') || params.get('vote_average_gte') || 0);
  const ratingMax = Number(params.get('ratingMax') || 10);
  const minVotes = Number(params.get('minVoteCount') || params.get('vote_count_gte') || 0);
  const runtimeMin = Number(params.get('runtimeMin') || params.get('runtime_gte') || 0);
  const runtimeMax = Number(params.get('runtimeMax') || 999);
  const language = (params.get('language') || '').trim().toLowerCase();
  const country = (params.get('country') || params.get('with_origin_country') || '').trim().toUpperCase();
  const withPeople = Number(params.get('with_people') || 0);
  const withCompanies = Number(params.get('with_companies') || 0);
  const withType = params.get('with_type');
  const sortBy = params.get('sort_by') || 'popularity.desc';
  const page = Math.max(1, Number(params.get('page') || 1));

  let items = VAULT_SEEDS.filter((item) => {
    if (categoryType === 'anime') {
      if (item.category !== 'anime' && !item.genreIds.includes(16)) return false;
    } else if (categoryType === 'show') {
      if (item.mediaType !== 'tv') return false;
    } else if (media === 'movie' || media === 'tv') {
      if (item.mediaType !== media) return false;
    }

    if (withGenres.length > 0 && !withGenres.some((g) => item.genreIds.includes(g))) {
      return false;
    }
    if (withoutGenres.length > 0 && withoutGenres.some((g) => item.genreIds.includes(g))) {
      return false;
    }
    const yr = Number(item.year);
    if (yr && (yr < yearMin || yr > yearMax)) return false;
    const sc = Number(item.score);
    if (sc && (sc < ratingMin || sc > ratingMax)) return false;
    if (item.voteCount < minVotes) return false;
    if (item.runtime && (item.runtime < runtimeMin || item.runtime > runtimeMax)) return false;
    if (language && language !== 'all' && item.language !== language) return false;
    if (country && country !== 'ALL' && item.country !== country) return false;
    if (withPeople > 0 && !(item.directorIds || []).includes(withPeople) && !item.cast.some((c) => c.id === withPeople)) {
      return false;
    }
    if (withCompanies > 0 && !(item.companyIds || []).includes(withCompanies)) {
      return false;
    }
    if (withType === '2' && !item.isLimitedSeries) {
      return false;
    }
    return true;
  });

  items = [...items].sort((a, b) => {
    if (sortBy === 'vote_average.desc') return Number(b.score) - Number(a.score);
    if (sortBy === 'primary_release_date.desc' || sortBy === 'first_air_date.desc' || sortBy === 'date') {
      return b.releaseDate.localeCompare(a.releaseDate);
    }
    if (sortBy === 'revenue.desc') return (b.revenue || 0) - (a.revenue || 0);
    return b.popularity - a.popularity;
  });

  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const sliced = items.slice(start, start + pageSize).map(
    ({ imdbId: _i, contentRating: _c, youtubeTrailerKey: _y, directors: _d, cast: _ca, collection: _co, ...summary }) => summary,
  );

  return {
    list: sliced,
    page,
    total_pages: Math.max(1, Math.ceil(items.length / pageSize)),
    total_results: items.length,
  };
}

export function searchVaultCatalog(query: string): {
  results: MediaSummary[];
  people: PersonResult[];
} {
  const q = query.trim().toLowerCase();
  if (!q) return { results: [], people: [] };

  const results = VAULT_SEEDS.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.overview.toLowerCase().includes(q) ||
      item.genres.some((g) => g.toLowerCase().includes(q)) ||
      item.directors.some((d) => d.name.toLowerCase().includes(q)) ||
      item.cast.some((c) => c.name.toLowerCase().includes(q)) ||
      item.year.includes(q),
  )
    .sort((a, b) => {
      const aExact = a.title.toLowerCase().startsWith(q) ? 1 : 0;
      const bExact = b.title.toLowerCase().startsWith(q) ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      return b.popularity - a.popularity;
    })
    .map(({ imdbId: _i, contentRating: _c, youtubeTrailerKey: _y, directors: _d, cast: _ca, collection: _co, ...summary }) => summary);

  const peopleMap = new Map<number, PersonResult>();
  for (const seed of VAULT_SEEDS) {
    for (const dir of seed.directors) {
      if (dir.name.toLowerCase().includes(q) && !peopleMap.has(dir.id)) {
        peopleMap.set(dir.id, {
          id: dir.id,
          name: dir.name,
          profile: '',
          popularity: 95,
          department: 'Directing',
          knownFor: VAULT_SEEDS.filter((s) => s.directors.some((d) => d.id === dir.id)).map((s) => s.title),
        });
      }
    }
    for (const actor of seed.cast) {
      if (actor.name.toLowerCase().includes(q) && !peopleMap.has(actor.id)) {
        peopleMap.set(actor.id, {
          id: actor.id,
          name: actor.name,
          profile: '',
          popularity: 88,
          department: 'Acting',
          knownFor: VAULT_SEEDS.filter((s) => s.cast.some((c) => c.id === actor.id)).map((s) => s.title),
        });
      }
    }
  }

  return { results, people: Array.from(peopleMap.values()) };
}

export function getVaultPerson(id: number): PersonResult | null {
  const credits: MediaSummary[] = [];
  let name = '';
  let department = 'Acting';

  for (const seed of VAULT_SEEDS) {
    const asDir = seed.directors.find((d) => d.id === id);
    const asCast = seed.cast.find((c) => c.id === id);
    if (asDir || asCast) {
      if (!name) {
        name = asDir ? asDir.name : asCast!.name;
        department = asDir ? 'Directing' : 'Acting';
      }
      const { imdbId: _i, contentRating: _c, youtubeTrailerKey: _y, directors: _d, cast: _ca, collection: _co, ...summary } = seed;
      credits.push(summary);
    }
  }

  if (!name) return null;

  return {
    id,
    name,
    profile: '',
    popularity: 92,
    department,
    knownFor: credits.map((c) => c.title),
    biography: `${name} is a celebrated ${department === 'Directing' ? 'filmmaker and director' : 'screen actor'} featured across ${credits.length} acclaimed title${credits.length === 1 ? '' : 's'} in the Dexterx Cenima vault.`,
    credits,
  };
}
