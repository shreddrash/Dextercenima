import type {
  CastMember,
  EpisodeItem,
  MediaDetail,
  MediaSummary,
  MediaType,
  PersonResult,
  SeasonDetail,
  StreamingPlatform,
} from './types';
import { EXTRA_PLATFORM_SEEDS } from './platformSeeds';

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

interface VaultSeed extends MediaSummary {
  imdbId: string;
  contentRating: string;
  youtubeTrailerKey?: string;
  directors: Array<{ id: number; name: string; profile?: string }>;
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
    logo: 'https://image.tmdb.org/t/p/w500/hWLa38bScpzdocm0ZTyywDbwV45.png',
    overview:
      'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    poster: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
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
    directorIds: [27571, 137427],
    contentRating: 'PG-13',
    youtubeTrailerKey: 'Way9Dexny3w',
    directors: [{ id: 137427, name: 'Denis Villeneuve' }],
    cast: [
      { id: 1190668, name: 'Timothee Chalamet', character: 'Paul Atreides' },
      { id: 505710, name: 'Zendaya', character: 'Chani' },
      { id: 933238, name: 'Rebecca Ferguson', character: 'Lady Jessica' },
      { id: 16483, name: 'Javier Bardem', character: 'Stilgar' },
    ],
    collection: { id: 726871, name: 'Dune Collection', partIds: [438631, 693134] },
  },
  {
    id: 157336,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt0816692',
    title: 'Interstellar',
    logo: 'https://image.tmdb.org/t/p/w500/4Hu4w5p0mwL2Wvyk3gqu2JRDGHl.png',
    overview:
      'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer vast cosmic distances.',
    poster: 'https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8sNiAPPYU14PUepFNeSNGUTiHW.jpg',
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
    logo: 'https://image.tmdb.org/t/p/w500/eS5TjZsO30LTfZISyBbPiXshAKd.png',
    overview:
      'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered impossible.',
    poster: 'https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
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
    logo: 'https://image.tmdb.org/t/p/w500/nO5Uix3Qr4WjOyU1BMPv0okyNWm.png',
    overview:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, he sets out to dismantle the remaining criminal organizations.',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg',
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
    logo: 'https://image.tmdb.org/t/p/w500/b07VisHvZb0WzUpA8VB77wfMXwg.png',
    overview:
      'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg',
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
    id: 496243,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt6751668',
    title: 'Parasite',
    logo: 'https://image.tmdb.org/t/p/w500/eEGZWCv0OYbMLCaNsDl1cgrvnWR.png',
    overview:
      'All unemployed, Ki-taek’s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
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
  // Hindi Blockbuster Movies
  {
    id: 872906,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt15354916',
    title: 'Jawan',
    logo: 'https://image.tmdb.org/t/p/w500/yJVRQwbPrpJG0jYjoKHorYnAlrk.png',
    overview:
      'A high-octane action thriller outlining the emotional journey of a man set to rectify the wrongs in society.',
    poster: 'https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/5LtSjMNw6j3LkG29Oa4O0iY5U8.jpg',
    posterTheme: 'thriller',
    score: '7.0',
    voteCount: 950,
    year: '2023',
    releaseDate: '2023-09-07',
    runtime: 169,
    seasons: null,
    episodes: null,
    genreIds: [28, 53],
    genres: ['Action', 'Thriller'],
    language: 'hi',
    country: 'IN',
    popularity: 930,
    revenue: 140000000,
    directorIds: [1209903],
    contentRating: 'UA',
    youtubeTrailerKey: 'COv52Qyctws',
    directors: [{ id: 1209903, name: 'Atlee' }],
    cast: [
      {
        id: 35742,
        name: 'Shah Rukh Khan',
        character: 'Vikram Rathore / Azad',
        profile: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg',
      },
      {
        id: 91548,
        name: 'Nayanthara',
        character: 'Narmada',
        profile: 'https://image.tmdb.org/t/p/w185/sYUzvjsSsqeOgBblSzda6ZwwbEa.jpg',
      },
      {
        id: 1123766,
        name: 'Vijay Sethupathi',
        character: 'Kalee Gaikwad',
        profile: 'https://image.tmdb.org/t/p/w185/a3HWdfCAbplrvoMNEJCjnkbqqOo.jpg',
      },
      {
        id: 53975,
        name: 'Deepika Padukone',
        character: 'Aishwarya Rathore',
        profile: 'https://image.tmdb.org/t/p/w185/rzvvBQ0r6oiqDdzcsdTRB7jN4Rx.jpg',
      },
    ],
  },
  {
    id: 864692,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt12844910',
    title: 'Pathaan',
    logo: 'https://image.tmdb.org/t/p/w500/5MOroJhG2jpVhQErpG3O4y6E2zZ.png',
    overview:
      'An exiled Indian spy races against time to stop a rogue mercenary group from unleashing a deadly biological threat.',
    poster: 'https://image.tmdb.org/t/p/w500/arf00BkwvXo0CFKbaD9OpqdE4Nu.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/o0nLkPesXPugGw0rB15hDhZd1DX.jpg',
    posterTheme: 'obsidian',
    score: '6.3',
    voteCount: 820,
    year: '2023',
    releaseDate: '2023-01-25',
    runtime: 146,
    seasons: null,
    episodes: null,
    genreIds: [28, 12, 53],
    genres: ['Action', 'Adventure', 'Thriller'],
    language: 'hi',
    country: 'IN',
    popularity: 890,
    revenue: 130000000,
    directorIds: [35785],
    contentRating: 'UA',
    youtubeTrailerKey: 'vqu4z34wENw',
    directors: [{ id: 35785, name: 'Siddharth Anand' }],
    cast: [
      {
        id: 35742,
        name: 'Shah Rukh Khan',
        character: 'Pathaan',
        profile: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg',
      },
      {
        id: 53975,
        name: 'Deepika Padukone',
        character: 'Rubina Mohsin',
        profile: 'https://image.tmdb.org/t/p/w185/rzvvBQ0r6oiqDdzcsdTRB7jN4Rx.jpg',
      },
      {
        id: 52971,
        name: 'John Abraham',
        character: 'Jim',
        profile: 'https://image.tmdb.org/t/p/w185/xqOzxrbBkgbzT0pgAR2k03Hvd30.jpg',
      },
    ],
  },
  {
    id: 781732,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt13751694',
    title: 'Animal',
    logo: 'https://image.tmdb.org/t/p/w500/aM0QC0EmfPD84AtjGIv2UJ9yu6J.png',
    overview:
      'A son’s obsessive devotion to his emotionally distant father triggers a relentless cycle of vengeance in the criminal underworld.',
    poster: 'https://image.tmdb.org/t/p/w500/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/lprsAHkwMxk2iC6VZxNmV0H7g1t.jpg',
    posterTheme: 'noir',
    score: '6.1',
    voteCount: 680,
    year: '2023',
    releaseDate: '2023-12-01',
    runtime: 201,
    seasons: null,
    episodes: null,
    genreIds: [28, 80, 18],
    genres: ['Action', 'Crime', 'Drama'],
    language: 'hi',
    country: 'IN',
    popularity: 870,
    revenue: 110000000,
    directorIds: [1879517],
    contentRating: 'A',
    youtubeTrailerKey: '8FkLRUJj-o0',
    directors: [{ id: 1879517, name: 'Sandeep Reddy Vanga' }],
    cast: [
      {
        id: 85034,
        name: 'Ranbir Kapoor',
        character: 'Ranvijay Balbir Singh',
        profile: 'https://image.tmdb.org/t/p/w185/ymYNHV9luwgyrw17NXHqbOWTQkg.jpg',
      },
      {
        id: 1752056,
        name: 'Rashmika Mandanna',
        character: 'Geetanjali Singh',
        profile: 'https://image.tmdb.org/t/p/w185/lj16BGfdqygHF8PZVt2KO8GUXn1.jpg',
      },
      {
        id: 77235,
        name: 'Bobby Deol',
        character: 'Abrar Haque',
        profile: 'https://image.tmdb.org/t/p/w185/2npVa3PduichY8e7qBiE54m9VVP.jpg',
      },
    ],
  },
  {
    id: 801688,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt12735488',
    title: 'Kalki 2898-AD',
    logo: 'https://image.tmdb.org/t/p/w500/phv0D4lpztKSUqNByCJkP1HB1IS.png',
    overview:
      'In a dystopian future ruled by the tyrannical Complex, a bounty hunter and an ancient warrior collide over the fate of humanity.',
    poster: 'https://image.tmdb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/seAIZLEq2Il2psjMUREDbSdRmbu.jpg',
    posterTheme: 'cosmic',
    score: '6.4',
    voteCount: 540,
    year: '2024',
    releaseDate: '2024-06-26',
    runtime: 176,
    seasons: null,
    episodes: null,
    genreIds: [18, 28, 14, 878],
    genres: ['Drama', 'Action', 'Fantasy', 'Sci-Fi'],
    language: 'hi',
    country: 'IN',
    popularity: 910,
    revenue: 135000000,
    directorIds: [1508808],
    contentRating: 'UA',
    youtubeTrailerKey: 'y1-w1kUGuz8',
    directors: [{ id: 1508808, name: 'Nag Ashwin' }],
    cast: [
      {
        id: 35780,
        name: 'Amitabh Bachchan',
        character: 'Ashwatthama',
        profile: 'https://image.tmdb.org/t/p/w185/u69PvpWqGkywSm0YjFiw77j9eqS.jpg',
      },
      {
        id: 237045,
        name: 'Prabhas',
        character: 'Bhairava / Karna',
        profile: 'https://image.tmdb.org/t/p/w185/u6RVP8ukgLaymeoi5VmX0JRAcCn.jpg',
      },
      {
        id: 53975,
        name: 'Deepika Padukone',
        character: 'Sumathi',
        profile: 'https://image.tmdb.org/t/p/w185/rzvvBQ0r6oiqDdzcsdTRB7jN4Rx.jpg',
      },
    ],
  },
  {
    id: 579974,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt8178634',
    title: 'RRR',
    logo: 'https://image.tmdb.org/t/p/w500/hbHECFGS7IsBCA3DSC1dPgLm2Ig.png',
    overview:
      'A fearless revolutionary and an officer in the British force forge an unforgettable bond while fighting for destiny and freedom.',
    poster: 'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/i0Y0wP8H6SRgjr6QmuwbtQbS24D.jpg',
    posterTheme: 'obsidian',
    score: '7.7',
    voteCount: 1650,
    year: '2022',
    releaseDate: '2022-03-24',
    runtime: 187,
    seasons: null,
    episodes: null,
    genreIds: [28, 36, 18],
    genres: ['Action', 'History', 'Drama'],
    language: 'hi',
    country: 'IN',
    popularity: 860,
    revenue: 160000000,
    directorIds: [147021],
    contentRating: 'UA',
    youtubeTrailerKey: 'f_vbAtFSEc0',
    directors: [{ id: 147021, name: 'S. S. Rajamouli' }],
    cast: [
      {
        id: 148037,
        name: 'N.T. Rama Rao Jr.',
        character: 'Komaram Bheem',
        profile: 'https://image.tmdb.org/t/p/w185/5ycQgZ3SPUa12bq0yn1jpToBq9X.jpg',
      },
      {
        id: 147023,
        name: 'Ram Charan',
        character: 'Alluri Sitarama Raju',
        profile: 'https://image.tmdb.org/t/p/w185/twGqYUCR0Yh33j3TcgRTZRBRhTd.jpg',
      },
    ],
  },
  {
    id: 20453,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt1187043',
    title: '3 Idiots',
    logo: 'https://image.tmdb.org/t/p/w500/v6Hihdrx8TajNEbWSDD8cxi5er1.png',
    overview:
      'Two friends embark on a quest to find their long-lost college companion who inspired them to think differently and chase excellence.',
    poster: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/u7kuUaySqXBVAtqEl9vkTkAzHV9.jpg',
    posterTheme: 'obsidian',
    score: '8.0',
    voteCount: 2500,
    year: '2009',
    releaseDate: '2009-12-23',
    runtime: 171,
    seasons: null,
    episodes: null,
    genreIds: [18, 35],
    genres: ['Drama', 'Comedy'],
    language: 'hi',
    country: 'IN',
    popularity: 840,
    revenue: 90000000,
    directorIds: [85675],
    contentRating: 'UA',
    youtubeTrailerKey: 'K0eDlFX9GMc',
    directors: [{ id: 85675, name: 'Rajkumar Hirani' }],
    cast: [
      {
        id: 52763,
        name: 'Aamir Khan',
        character: 'Rancho',
        profile: 'https://image.tmdb.org/t/p/w185/6uiZSwi2kvd1jZ7X7Xz9W9VGuV4.jpg',
      },
      {
        id: 85519,
        name: 'R. Madhavan',
        character: 'Farhan Qureshi',
        profile: 'https://image.tmdb.org/t/p/w185/gaDrAdXxIrbBRCd9cX8YvJDEuLb.jpg',
      },
      {
        id: 37233,
        name: 'Kareena Kapoor Khan',
        character: 'Pia',
        profile: 'https://image.tmdb.org/t/p/w185/kp9xnwDALUt6nuPBGuJHlvnxGnM.jpg',
      },
    ],
  },
  {
    id: 360814,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt5074352',
    title: 'Dangal',
    logo: 'https://image.tmdb.org/t/p/w500/w9Bxolh7pQY8SfNPPpuKahQhxkY.png',
    overview:
      'Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to become India’s first world-class female wrestlers.',
    poster: 'https://image.tmdb.org/t/p/w500/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/l0fNAHLOFReQJsxCOmGWvJDnimn.jpg',
    posterTheme: 'obsidian',
    score: '7.9',
    voteCount: 1100,
    year: '2016',
    releaseDate: '2016-12-21',
    runtime: 161,
    seasons: null,
    episodes: null,
    genreIds: [18, 10751, 35],
    genres: ['Drama', 'Family', 'Comedy'],
    language: 'hi',
    country: 'IN',
    popularity: 820,
    revenue: 300000000,
    directorIds: [1042010],
    contentRating: 'U',
    youtubeTrailerKey: 'x_7YlGv9u1g',
    directors: [{ id: 1042010, name: 'Nitesh Tiwari' }],
    cast: [
      {
        id: 52763,
        name: 'Aamir Khan',
        character: 'Mahavir Singh Phogat',
        profile: 'https://image.tmdb.org/t/p/w185/6uiZSwi2kvd1jZ7X7Xz9W9VGuV4.jpg',
      },
      {
        id: 1046204,
        name: 'Fatima Sana Shaikh',
        character: 'Geeta Phogat',
        profile: 'https://image.tmdb.org/t/p/w185/eVOziSvi6PLL5vkROHO1sbsKUFW.jpg',
      },
    ],
  },
  {
    id: 587412,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt10698680',
    title: 'K.G.F: Chapter 2',
    overview:
      'In the blood-soaked Kolar Gold Fields, Rocky’s name strikes fear into his foes while allies look up to him as a savior.',
    poster: 'https://image.tmdb.org/t/p/w500/khNVygolU0TxLIDWff5tQlAhZ23.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/nsV5Mfi9FAV4w8eDsdr7uqVswOk.jpg',
    posterTheme: 'noir',
    score: '7.4',
    voteCount: 650,
    year: '2022',
    releaseDate: '2022-04-14',
    runtime: 168,
    seasons: null,
    episodes: null,
    genreIds: [28, 53],
    genres: ['Action', 'Thriller'],
    language: 'hi',
    country: 'IN',
    popularity: 850,
    revenue: 160000000,
    directorIds: [2182258],
    contentRating: 'UA',
    youtubeTrailerKey: 'JKa05nyUmuQ',
    directors: [{ id: 2182258, name: 'Prashanth Neel' }],
    cast: [
      {
        id: 1293681,
        name: 'Yash',
        character: 'Rocky',
        profile: 'https://image.tmdb.org/t/p/w185/es8St0vl9otL1XAAZJKYmNpL3Wy.jpg',
      },
      {
        id: 85881,
        name: 'Sanjay Dutt',
        character: 'Adheera',
        profile: 'https://image.tmdb.org/t/p/w185/70viNBvKHpX1kMZcfIwULqWnfdM.jpg',
      },
    ],
  },
  {
    id: 256040,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt2631186',
    title: 'Bāhubali: The Beginning',
    logo: 'https://image.tmdb.org/t/p/w500/69YQrfMCEHRMFPqvsOo6NnbLAJv.png',
    overview:
      'A young man raised in a remote village learns of his royal heritage and destiny to liberate the kingdom of Mahishmati.',
    poster: 'https://image.tmdb.org/t/p/w500/9BAjt8nSSms62uOVYn1t3C3dVto.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/e9ZEuHGHZ06AToHlfN1L7nejJ7W.jpg',
    posterTheme: 'cosmic',
    score: '7.6',
    voteCount: 950,
    year: '2015',
    releaseDate: '2015-07-09',
    runtime: 158,
    seasons: null,
    episodes: null,
    genreIds: [28, 18],
    genres: ['Action', 'Drama'],
    language: 'hi',
    country: 'IN',
    popularity: 800,
    revenue: 100000000,
    directorIds: [147021],
    contentRating: 'UA',
    youtubeTrailerKey: 'sOEg_YZQsTI',
    directors: [{ id: 147021, name: 'S. S. Rajamouli' }],
    cast: [
      {
        id: 237045,
        name: 'Prabhas',
        character: 'Mahendra / Amarendra Bāhubali',
        profile: 'https://image.tmdb.org/t/p/w185/u6RVP8ukgLaymeoi5VmX0JRAcCn.jpg',
      },
      {
        id: 215910,
        name: 'Rana Daggubati',
        character: 'Bhallaladeva',
        profile: 'https://image.tmdb.org/t/p/w185/q0Rw0e9RogMD0zJ0Heq0GotDYoy.jpg',
      },
    ],
  },
  {
    id: 1163258,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt23849204',
    title: '12th Fail',
    logo: 'https://image.tmdb.org/t/p/w500/nhnKWMtAdD31Wklbq4JR4IDWbHa.png',
    overview:
      'Based on a true story, Manoj Kumar Sharma restarts his academic journey against overwhelming odds to become an IPS officer.',
    poster: 'https://image.tmdb.org/t/p/w500/eebUPRI4Z5e1Z7Hev4JZAwMIFkX.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/6RV2o8PBCEyw9ylOWViV1CtULIF.jpg',
    posterTheme: 'obsidian',
    score: '8.0',
    voteCount: 450,
    year: '2023',
    releaseDate: '2023-08-11',
    runtime: 146,
    seasons: null,
    episodes: null,
    genreIds: [18],
    genres: ['Drama'],
    language: 'hi',
    country: 'IN',
    popularity: 830,
    directorIds: [99710],
    contentRating: 'U',
    youtubeTrailerKey: 'WeMJo701mvQ',
    directors: [{ id: 99710, name: 'Vidhu Vinod Chopra' }],
    cast: [
      {
        id: 1208682,
        name: 'Vikrant Massey',
        character: 'Manoj Kumar Sharma',
        profile: 'https://image.tmdb.org/t/p/w185/zvpP52P7CtVXYONmvWrH1aOcRTx.jpg',
      },
      {
        id: 3112841,
        name: 'Medha Shankr',
        character: 'Shraddha Joshi',
        profile: 'https://image.tmdb.org/t/p/w185/aVemlgs6LIf1GzrpTPjyoV14Y2s.jpg',
      },
    ],
  },
  {
    id: 538858,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt8239946',
    title: 'Tumbbad',
    logo: 'https://image.tmdb.org/t/p/w500/aFWoPbHwd44IHFUmpEcX8K6JBuF.png',
    overview:
      'A mythological story about a goddess who created the entire universe, and the cursed treasure guarded by her disowned firstborn.',
    poster: 'https://image.tmdb.org/t/p/w500/z1xOCxw780WFJC5uCTMfCkQ4Agi.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/l0YKBu3LaehIFzBNjseLjx7MbaN.jpg',
    posterTheme: 'thriller',
    score: '7.6',
    voteCount: 520,
    year: '2018',
    releaseDate: '2018-10-12',
    runtime: 113,
    seasons: null,
    episodes: null,
    genreIds: [14, 27],
    genres: ['Fantasy', 'Horror'],
    language: 'hi',
    country: 'IN',
    popularity: 770,
    directorIds: [2094972],
    contentRating: 'A',
    youtubeTrailerKey: 'sN75MPxgvX8',
    directors: [{ id: 2094972, name: 'Rahi Anil Barve' }],
    cast: [
      {
        id: 1061615,
        name: 'Sohum Shah',
        character: 'Vinayak Rao',
        profile: 'https://image.tmdb.org/t/p/w185/5B7hSdq9hWEICHVxZtiL2ekwpzx.jpg',
      },
    ],
  },
  {
    id: 297222,
    mediaType: 'movie',
    category: 'movie',
    imdbId: 'tt2338151',
    title: 'PK',
    logo: 'https://image.tmdb.org/t/p/w500/BnDydsaEeMhywD5Snv6jN77ifh.png',
    overview:
      'A stranded alien on Earth questions human superstitions and blind dogma while searching for the remote control to his spaceship.',
    poster: 'https://image.tmdb.org/t/p/w500/z2x2Y4tncefsIU7h82gmUM5vnBJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/gxfvtq5eYiClS2X7hxAAPBNrbWA.jpg',
    posterTheme: 'obsidian',
    score: '7.7',
    voteCount: 1200,
    year: '2014',
    releaseDate: '2014-12-18',
    runtime: 153,
    seasons: null,
    episodes: null,
    genreIds: [35, 18, 878],
    genres: ['Comedy', 'Drama', 'Sci-Fi'],
    language: 'hi',
    country: 'IN',
    popularity: 790,
    revenue: 120000000,
    directorIds: [85675],
    contentRating: 'UA',
    youtubeTrailerKey: 'SOXWc32k4zA',
    directors: [{ id: 85675, name: 'Rajkumar Hirani' }],
    cast: [
      {
        id: 52763,
        name: 'Aamir Khan',
        character: 'PK',
        profile: 'https://image.tmdb.org/t/p/w185/6uiZSwi2kvd1jZ7X7Xz9W9VGuV4.jpg',
      },
      {
        id: 81928,
        name: 'Anushka Sharma',
        character: 'Jaggu',
        profile: 'https://image.tmdb.org/t/p/w185/fPhX9mefBzco5ntQUZNJZG56Gbi.jpg',
      },
    ],
  },
  // Hindi Web Series
  {
    id: 84105,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt6473300',
    title: 'Mirzapur',
    overview:
      'A shocking incident at a wedding procession ignites a series of events entangling the lives of two families in the lawless city of Mirzapur.',
    poster: 'https://image.tmdb.org/t/p/w500/p0qM8hhlMF5DuxHBzl2EZR6TehX.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/3dV7pWAdwIPKR2lMIACMfObXdgK.jpg',
    posterTheme: 'thriller',
    score: '8.0',
    voteCount: 650,
    year: '2018',
    releaseDate: '2018-11-15',
    runtime: 45,
    seasons: 3,
    episodes: 29,
    genreIds: [80, 10759, 18],
    genres: ['Crime', 'Action & Adventure', 'Drama'],
    language: 'hi',
    country: 'IN',
    popularity: 920,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'ZNeGF-PvRHY',
    directors: [],
    cast: [
      {
        id: 492791,
        name: 'Ali Fazal',
        character: 'Guddu Pandit',
        profile: 'https://image.tmdb.org/t/p/w185/lLDmx3RDuMXObASvdFXeUh1GOgd.jpg',
      },
      {
        id: 1179460,
        name: 'Pankaj Tripathi',
        character: 'Kaleen Bhaiya',
        profile: 'https://image.tmdb.org/t/p/w185/429hnZC7O6GEDs7DWHdYMI27h8I.jpg',
      },
    ],
  },
  {
    id: 79352,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt6077448',
    title: 'Sacred Games',
    logo: 'https://image.tmdb.org/t/p/w500/fgXbyvd5HkWINfibPvr5M2Po99s.png',
    overview:
      'A link in their pasts leads an honest cop to a fugitive gang boss, whose cryptic warning spurs the officer on a quest to save Mumbai.',
    poster: 'https://image.tmdb.org/t/p/w500/uEbNtFbK4At9WBDGap23lt1qO9n.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/qtac9X9lSLqZFbxS71347N8MiID.jpg',
    posterTheme: 'noir',
    score: '8.1',
    voteCount: 480,
    year: '2018',
    releaseDate: '2018-07-06',
    runtime: 50,
    seasons: 2,
    episodes: 16,
    genreIds: [80, 18, 9648],
    genres: ['Crime', 'Drama', 'Mystery'],
    language: 'hi',
    country: 'IN',
    popularity: 880,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'AkUgf2jIPyI',
    directors: [],
    cast: [{ id: 1179460, name: 'Pankaj Tripathi', character: 'Guruji', profile: 'https://image.tmdb.org/t/p/w185/429hnZC7O6GEDs7DWHdYMI27h8I.jpg' }],
  },
  {
    id: 93352,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt9544034',
    title: 'The Family Man',
    logo: 'https://image.tmdb.org/t/p/w500/68lmB8jvkEjLh5EVH053UOD1Mug.png',
    overview:
      'A middle-class man secretly works as a world-class intelligence agent while trying to protect his family from his dangerous job.',
    poster: 'https://image.tmdb.org/t/p/w500/tE1NUJqw9gV6AVjQ1GTK78LbWJ9.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/eEzKigDI64OomZV6VTJvoPGmVu1.jpg',
    posterTheme: 'obsidian',
    score: '7.7',
    voteCount: 380,
    year: '2019',
    releaseDate: '2019-09-20',
    runtime: 45,
    seasons: 3,
    episodes: 26,
    genreIds: [18, 10759],
    genres: ['Drama', 'Action & Adventure'],
    language: 'hi',
    country: 'IN',
    popularity: 870,
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'XatRGut65VI',
    directors: [{ id: 3095689, name: 'Suman Kumar' }],
    cast: [
      {
        id: 35782,
        name: 'Manoj Bajpayee',
        character: 'Srikant Tiwari',
        profile: 'https://image.tmdb.org/t/p/w185/hBiAldG2BGMVoZUPbvK3FNDSw22.jpg',
      },
      {
        id: 1107197,
        name: 'Priyamani',
        character: 'Suchitra Tiwari',
        profile: 'https://image.tmdb.org/t/p/w185/grcW2eMm77Q2Kj1xX0HvZlRpGRR.jpg',
      },
    ],
  },
  {
    id: 101352,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt12004706',
    title: 'Panchayat',
    overview:
      'An engineering graduate reluctantly takes a job as secretary of a panchayat office in a remote Uttar Pradesh village.',
    poster: 'https://image.tmdb.org/t/p/w500/cPPhduQk1eX0MAE2JDaQRh3UZB5.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/iZ8EtGAqKWZdRJPzWfFseNfVxjh.jpg',
    posterTheme: 'obsidian',
    score: '8.2',
    voteCount: 310,
    year: '2020',
    releaseDate: '2020-03-05',
    runtime: 30,
    seasons: 5,
    episodes: 33,
    genreIds: [35, 18],
    genres: ['Comedy', 'Drama'],
    language: 'hi',
    country: 'IN',
    popularity: 860,
    contentRating: 'TV-14',
    directors: [{ id: 2306065, name: 'Deepak Kumar Mishra' }],
    cast: [
      {
        id: 1485519,
        name: 'Jitendra Kumar',
        character: 'Abhishek Tripathi',
        profile: 'https://image.tmdb.org/t/p/w185/562Mucw9YaDHUlFBqK5aot3H2lJ.jpg',
      },
      {
        id: 52974,
        name: 'Raghubir Yadav',
        character: 'Brij Bhushan Dubey',
        profile: 'https://image.tmdb.org/t/p/w185/khyp4vnuGKVxrtszyB7kSf3vuzw.jpg',
      },
    ],
  },
  {
    id: 111188,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt12392504',
    title: 'Scam 1992: The Harshad Mehta Story',
    logo: 'https://image.tmdb.org/t/p/w500/bspjlUTYI0Ah8zUa4P2SGy2OlUU.png',
    overview:
      'Set in 1980s and 90s Bombay, it follows the meteoric rise and catastrophic fall of stockbroker Harshad Mehta.',
    poster: 'https://image.tmdb.org/t/p/w500/cBVPwBSVNSVtQocQfyHPFqoIohj.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/tTYP1npvBU90NthceezScfXGiOl.jpg',
    posterTheme: 'noir',
    score: '8.7',
    voteCount: 290,
    year: '2020',
    releaseDate: '2020-10-09',
    runtime: 55,
    seasons: 1,
    episodes: 10,
    genreIds: [18, 80],
    genres: ['Drama', 'Crime'],
    language: 'hi',
    country: 'IN',
    popularity: 850,
    isLimitedSeries: true,
    contentRating: 'TV-14',
    directors: [],
    cast: [],
  },
  {
    id: 132117,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt15477488',
    title: 'Farzi',
    logo: 'https://image.tmdb.org/t/p/w500/hf290P6cecn58m0Zkjksuj9DgQz.png',
    overview:
      'A disillusioned small-time artist designs the ultimate counterfeit currency scheme while a fiery task force officer hunts him down.',
    poster: 'https://image.tmdb.org/t/p/w500/cTS86RwEBIDgCgUmjWQTSoPsK6p.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/rGkjtv6UdL1ysDmZuBjbNl3PAA1.jpg',
    posterTheme: 'thriller',
    score: '7.9',
    voteCount: 240,
    year: '2023',
    releaseDate: '2023-02-10',
    runtime: 55,
    seasons: 1,
    episodes: 8,
    genreIds: [80, 18, 53],
    genres: ['Crime', 'Drama', 'Thriller'],
    language: 'hi',
    country: 'IN',
    popularity: 840,
    contentRating: 'TV-MA',
    directors: [],
    cast: [],
  },
  {
    id: 89113,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt9432978',
    title: 'Kota Factory',
    logo: 'https://image.tmdb.org/t/p/w500/nadMQ3noYmQBclEsvKqQzaOdpkE.png',
    overview:
      'Dedicated to Shrimati SL Loneyji, this series follows students in Kota navigating intense pressure to crack India’s toughest engineering exams.',
    poster: 'https://image.tmdb.org/t/p/w500/fMBookmwL6HjIgIVTjQ6EMr3pCH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/mQEmKXSFlzBlSoYgut0VfjxAzoA.jpg',
    posterTheme: 'obsidian',
    score: '8.3',
    voteCount: 220,
    year: '2019',
    releaseDate: '2019-04-16',
    runtime: 40,
    seasons: 3,
    episodes: 15,
    genreIds: [18, 35],
    genres: ['Drama', 'Comedy'],
    language: 'hi',
    country: 'IN',
    popularity: 810,
    contentRating: 'TV-14',
    directors: [],
    cast: [
      {
        id: 1485519,
        name: 'Jitendra Kumar',
        character: 'Jeetu Bhaiya',
        profile: 'https://image.tmdb.org/t/p/w185/562Mucw9YaDHUlFBqK5aot3H2lJ.jpg',
      },
    ],
  },
  {
    id: 124411,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt14392248',
    title: 'Aspirants',
    logo: 'https://image.tmdb.org/t/p/w500/qCvH4i34dVpj2c7rvIhEVUILnMo.png',
    overview:
      'Three friends in Old Rajinder Nagar pursue the UPSC Civil Services dream across ambition, heartbreak, and friendship.',
    poster: 'https://image.tmdb.org/t/p/w500/lG8wK40jH4EX6dbVFI1fzw2E96N.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/1g3856hsrYrSp6gWQMUpwqDw8Nb.jpg',
    posterTheme: 'obsidian',
    score: '8.4',
    voteCount: 190,
    year: '2021',
    releaseDate: '2021-04-07',
    runtime: 45,
    seasons: 2,
    episodes: 10,
    genreIds: [18],
    genres: ['Drama'],
    language: 'hi',
    country: 'IN',
    popularity: 790,
    contentRating: 'TV-14',
    directors: [],
    cast: [],
  },
  {
    id: 103051,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt9680448',
    title: 'Paatal Lok',
    logo: 'https://image.tmdb.org/t/p/w500/3n1mLL2A46USfLhNO5osThuA1zH.png',
    overview:
      'A cynical inspector gets the case of his career when four suspects are arrested in an assassination attempt on a famed journalist.',
    poster: 'https://image.tmdb.org/t/p/w500/8Hcq3HoJE4shH7BWkp9UNSFCE3O.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/bVKoX1AiN1jjUcvC7BkXypJPF2X.jpg',
    posterTheme: 'thriller',
    score: '7.9',
    voteCount: 240,
    year: '2020',
    releaseDate: '2020-05-15',
    runtime: 45,
    seasons: 2,
    episodes: 17,
    genreIds: [80, 18, 9648],
    genres: ['Crime', 'Drama', 'Mystery'],
    language: 'hi',
    country: 'IN',
    popularity: 800,
    contentRating: 'TV-MA',
    directors: [],
    cast: [],
  },
  {
    id: 100911,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt11912196',
    title: 'Asur',
    logo: 'https://image.tmdb.org/t/p/w500/wMb5COjj74qboUblSuUQ86D8r14.png',
    overview:
      'Set in Varanasi, a forensic expert returns to the CBI to hunt a calculating serial killer obsessed with ancient mythology.',
    poster: 'https://image.tmdb.org/t/p/w500/aw8W6JCrE3zsQexfvsu4cDjb1ub.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/eXUr34XTqYaDwyOerFpL6sUOgDL.jpg',
    posterTheme: 'noir',
    score: '8.1',
    voteCount: 210,
    year: '2020',
    releaseDate: '2020-03-02',
    runtime: 45,
    seasons: 2,
    episodes: 16,
    genreIds: [80, 9648, 53],
    genres: ['Crime', 'Mystery', 'Thriller'],
    language: 'hi',
    country: 'IN',
    popularity: 815,
    contentRating: 'TV-MA',
    directors: [],
    cast: [],
  },
  // Global Series & Anime
  {
    id: 94605,
    mediaType: 'tv',
    category: 'anime',
    imdbId: 'tt11126994',
    title: 'Arcane',
    logo: 'https://image.tmdb.org/t/p/w500/jXLNOzeEA8AoJy92dJTUUZXTMxK.png',
    overview:
      'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.',
    poster: 'https://image.tmdb.org/t/p/w500/87C0wecB8bHb1PsrKBI4kJiEkgV.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg',
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
    ],
  },
  {
    id: 127532,
    mediaType: 'tv',
    category: 'anime',
    imdbId: 'tt21209876',
    title: 'Solo Leveling',
    logo: 'https://image.tmdb.org/t/p/w500/soogvWTvbW2YVpZwUz0SgPBKiVa.png',
    overview:
      'In a world where hunters must battle deadly monsters to protect humanity, Sung Jinwoo finds a hidden system allowing him to level up infinitely.',
    poster: 'https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xMNH87maNLt9n2bMDYeI6db5VFm.jpg',
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
    logo: 'https://image.tmdb.org/t/p/w500/eHMfVTIwen9anB4HuvQlFRGZFms.png',
    overview:
      'Many years ago, the last remnants of humanity were forced to retreat behind towering walls to escape gigantic man-eating Titans.',
    poster: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
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
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'MGRm4IzK1SQ',
    directors: [{ id: 121940, name: 'Tetsuro Araki' }],
    cast: [{ id: 1013495, name: 'Yuki Kaji', character: 'Eren Yeager (voice)' }],
  },
  {
    id: 1396,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt0903747',
    title: 'Breaking Bad',
    logo: 'https://image.tmdb.org/t/p/w500/chw44B2VnLha8iiTdyZcIW0ZELC.png',
    overview:
      'Walter White, a New Mexico chemistry teacher, teams up with former student Jesse Pinkman to build a crystal meth empire.',
    poster: 'https://image.tmdb.org/t/p/w500/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
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
    contentRating: 'TV-MA',
    youtubeTrailerKey: 'HhesaQXLuRY',
    directors: [{ id: 66633, name: 'Vince Gilligan' }],
    cast: [
      { id: 17419, name: 'Bryan Cranston', character: 'Walter White' },
      { id: 84497, name: 'Aaron Paul', character: 'Jesse Pinkman' },
    ],
  },
  {
    id: 100088,
    mediaType: 'tv',
    category: 'tv',
    imdbId: 'tt3581920',
    title: 'The Last of Us',
    logo: 'https://image.tmdb.org/t/p/w500/msYtgZbEo8tAOJ37T50kgqulpKf.png',
    overview:
      'Twenty years after modern civilization has been destroyed, Joel is hired to smuggle 14-year-old Ellie out of a quarantine zone.',
    poster: 'https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/lY2DhbA7Hy44fAKddr06UrXWWaQ.jpg',
    posterTheme: 'obsidian',
    score: '8.6',
    voteCount: 5400,
    year: '2023',
    releaseDate: '2023-01-15',
    runtime: 59,
    seasons: 2,
    episodes: 16,
    genreIds: [18, 10765],
    genres: ['Drama', 'Sci-Fi & Fantasy'],
    language: 'en',
    country: 'US',
    popularity: 870,
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
    logo: 'https://image.tmdb.org/t/p/w500/e9qFk5zrKZaB2IbbOI9N0W77vlh.svg',
    overview:
      'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.',
    poster: 'https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
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
    contentRating: 'TV-14',
    youtubeTrailerKey: 'b9EkMc79ZSU',
    directors: [{ id: 1179419, name: 'The Duffer Brothers' }],
    cast: [
      { id: 1556202, name: 'Millie Bobby Brown', character: 'Eleven' },
      { id: 1474636, name: 'Finn Wolfhard', character: 'Mike Wheeler' },
    ],
  },
  // Kids Movies & Cartoons (Strict Kids-Safe Catalog)
  {
    id: 1022789,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt22022452',
    title: 'Inside Out 2',
    logo: 'https://image.tmdb.org/t/p/w500/h40hblm8J1if7T2CBMjCD85HwuD.png',
    overview:
      'Teenager Riley’s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions like Anxiety, Envy, Ennui, and Embarrassment!',
    poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg',
    posterTheme: 'anime',
    score: '7.5',
    voteCount: 5200,
    year: '2024',
    releaseDate: '2024-06-11',
    runtime: 97,
    seasons: null,
    episodes: null,
    genreIds: [16, 12, 35, 10751],
    genres: ['Animation', 'Adventure', 'Comedy', 'Family'],
    language: 'en',
    country: 'US',
    popularity: 990,
    contentRating: 'PG',
    youtubeTrailerKey: 'LEjhY15eCx0',
    directors: [{ id: 12891, name: 'Kelsey Mann' }],
    cast: [{ id: 1935224, name: 'Maya Hawke', character: 'Anxiety (voice)' }],
  },
  {
    id: 324857,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U/A 7+',
    imdbId: 'tt4633694',
    title: 'Spider-Man: Into the Spider-Verse',
    logo: 'https://image.tmdb.org/t/p/w500/xrM5rEtoW0Hd0QXmy5b4WBGZuHd.png',
    overview:
      'Teenager Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions to stop a threat.',
    poster: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/1ntePsIqeklfmrQJqZPncCydsqY.jpg',
    posterTheme: 'anime',
    score: '8.4',
    voteCount: 15500,
    year: '2018',
    releaseDate: '2018-12-06',
    runtime: 117,
    seasons: null,
    episodes: null,
    genreIds: [16, 28, 12, 10751],
    genres: ['Animation', 'Action', 'Adventure', 'Family'],
    language: 'en',
    country: 'US',
    popularity: 960,
    contentRating: 'PG',
    youtubeTrailerKey: 'g4Hbz2jLxvQ',
    directors: [],
    cast: [{ id: 587506, name: 'Shameik Moore', character: 'Miles Morales (voice)' }],
  },
  {
    id: 1011985,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt21692408',
    title: 'Kung Fu Panda 4',
    logo: 'https://image.tmdb.org/t/p/w500/QeAYsp12oO1o9vc1CTBDxxKgJk.png',
    overview:
      'Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.',
    poster: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/3ffPx9jqg0yj9y1KWeagT7D20CB.jpg',
    posterTheme: 'anime',
    score: '7.0',
    voteCount: 2800,
    year: '2024',
    releaseDate: '2024-03-02',
    runtime: 94,
    seasons: null,
    episodes: null,
    genreIds: [16, 35, 12, 10751],
    genres: ['Animation', 'Comedy', 'Adventure', 'Family'],
    language: 'en',
    country: 'US',
    popularity: 940,
    contentRating: 'PG',
    youtubeTrailerKey: '_inKs4eeHiI',
    directors: [],
    cast: [{ id: 70851, name: 'Jack Black', character: 'Po (voice)' }],
  },
  {
    id: 502356,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt6718170',
    title: 'The Super Mario Bros. Movie',
    logo: 'https://image.tmdb.org/t/p/w500/sst2kO7ySyAm3z5haWXUszOVWi2.png',
    overview:
      'While working underground to fix a water main, Brooklyn plumbers Mario and brother Luigi are transported down a mysterious pipe into a magical new world.',
    poster: 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg',
    posterTheme: 'anime',
    score: '7.6',
    voteCount: 9100,
    year: '2023',
    releaseDate: '2023-04-05',
    runtime: 93,
    seasons: null,
    episodes: null,
    genreIds: [16, 10751, 35, 12, 14],
    genres: ['Family', 'Comedy', 'Adventure', 'Fantasy', 'Animation'],
    language: 'en',
    country: 'US',
    popularity: 925,
    contentRating: 'PG',
    youtubeTrailerKey: 'TnGl01FkMMo',
    directors: [],
    cast: [{ id: 73457, name: 'Chris Pratt', character: 'Mario (voice)' }],
  },
  {
    id: 354912,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt2380307',
    title: 'Coco',
    logo: 'https://image.tmdb.org/t/p/w500/pLlaM6lXpKbwVCUdsqJ7axwb5UF.png',
    overview:
      'Despite his family’s baffling generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol Ernesto de la Cruz.',
    poster: 'https://image.tmdb.org/t/p/w500/6Ryitt95xrO8KXuqRGm1fUuNwqF.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/g7CHF8gTLGooTbP4GznIGwaqAGL.jpg',
    posterTheme: 'anime',
    score: '8.2',
    voteCount: 19400,
    year: '2017',
    releaseDate: '2017-10-27',
    runtime: 105,
    seasons: null,
    episodes: null,
    genreIds: [10751, 16, 10402, 12],
    genres: ['Family', 'Animation', 'Music', 'Adventure'],
    language: 'en',
    country: 'US',
    popularity: 910,
    contentRating: 'PG',
    youtubeTrailerKey: 'Ga6RYejo6Hk',
    directors: [],
    cast: [],
  },
  {
    id: 315162,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt3915174',
    title: 'Puss in Boots: The Last Wish',
    logo: 'https://image.tmdb.org/t/p/w500/j6x6l51OWbqN5Vsc7o6fLoqaHJR.png',
    overview:
      'Puss in Boots discovers that his passion for adventure has taken its toll: he has burned through eight of his nine lives, and sets out on an epic journey.',
    poster: 'https://image.tmdb.org/t/p/w500/kuf6dutpsT0vSVehic3EZIqkOBt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/jr8tSoJGj33XLgFBy6lmZhpGQNu.jpg',
    posterTheme: 'anime',
    score: '8.2',
    voteCount: 7800,
    year: '2022',
    releaseDate: '2022-12-07',
    runtime: 103,
    seasons: null,
    episodes: null,
    genreIds: [16, 12, 14, 35, 10751],
    genres: ['Animation', 'Adventure', 'Fantasy', 'Comedy', 'Family'],
    language: 'en',
    country: 'US',
    popularity: 905,
    contentRating: 'PG',
    youtubeTrailerKey: 'RqrXhwS33yc',
    directors: [],
    cast: [{ id: 3131, name: 'Antonio Banderas', character: 'Puss in Boots (voice)' }],
  },
  {
    id: 519182,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt7510222',
    title: 'Despicable Me 4',
    logo: 'https://image.tmdb.org/t/p/w500/89h1vVNsvFejMxhbrxPO9raMnbl.png',
    overview:
      'Gru and Lucy and their girls welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad while a new nemesis strikes.',
    poster: 'https://image.tmdb.org/t/p/w500/wWba3TaojhK7NdycRhoQpsG0FaH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/twsxsfao6ZOVvT8LfudH603MMi6.jpg',
    posterTheme: 'anime',
    score: '6.9',
    voteCount: 2400,
    year: '2024',
    releaseDate: '2024-06-20',
    runtime: 94,
    seasons: null,
    episodes: null,
    genreIds: [16, 35, 10751],
    genres: ['Animation', 'Comedy', 'Family'],
    language: 'en',
    country: 'US',
    popularity: 895,
    contentRating: 'PG',
    youtubeTrailerKey: 'qQlr9-rF32A',
    directors: [],
    cast: [{ id: 4495, name: 'Steve Carell', character: 'Gru (voice)' }],
  },
  {
    id: 277834,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt3521164',
    title: 'Moana',
    logo: 'https://image.tmdb.org/t/p/w500/oexzU1HUcq6Bzza4KMeU4MbzGza.png',
    overview:
      'In Ancient Polynesia, when a terrible curse incurred by Maui reaches an impetuous Chieftain’s daughter’s island, she answers the Ocean’s call.',
    poster: 'https://image.tmdb.org/t/p/w500/m5MDZOIFEFlxGiLuAzWzFSsWcye.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/qLVNZFHYUR6Li64He67SWl6BHQe.jpg',
    posterTheme: 'anime',
    score: '7.6',
    voteCount: 12600,
    year: '2016',
    releaseDate: '2016-10-13',
    runtime: 107,
    seasons: null,
    episodes: null,
    genreIds: [12, 35, 10751, 16],
    genres: ['Adventure', 'Comedy', 'Family', 'Animation'],
    language: 'en',
    country: 'US',
    popularity: 885,
    contentRating: 'PG',
    youtubeTrailerKey: 'LKFuXETZUsI',
    directors: [],
    cast: [],
  },
  {
    id: 109445,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt2294629',
    title: 'Frozen',
    logo: 'https://image.tmdb.org/t/p/w500/r05nI8WQvBbdvuwVXtXuvOi0cJ9.png',
    overview:
      'Young princess Anna of Arendelle dreams about finding true love while her sister Elsa accidentally sets off an eternal winter.',
    poster: 'https://image.tmdb.org/t/p/w500/itAKcobTYGpYT8Phwjd8c9hleTo.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/rj58WQ9ImI0mYDptXdM7euX1Wjt.jpg',
    posterTheme: 'anime',
    score: '7.2',
    voteCount: 16400,
    year: '2013',
    releaseDate: '2013-11-20',
    runtime: 102,
    seasons: null,
    episodes: null,
    genreIds: [16, 10751, 12, 14],
    genres: ['Animation', 'Family', 'Adventure', 'Fantasy'],
    language: 'en',
    country: 'US',
    popularity: 880,
    contentRating: 'PG',
    youtubeTrailerKey: 'TbQm5doF_Uc',
    directors: [],
    cast: [],
  },
  {
    id: 862,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt0114709',
    title: 'Toy Story',
    logo: 'https://image.tmdb.org/t/p/w500/eX8LcW1zdjxvWNB5ZsZuhPO7NtP.png',
    overview:
      'Led by Woody, Andy’s toys live happily in his room until Andy’s birthday brings Buzz Lightyear onto the scene.',
    poster: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8AqWECiUHnz1Crj69uB9vhiK9Le.jpg',
    posterTheme: 'anime',
    score: '8.0',
    voteCount: 18400,
    year: '1995',
    releaseDate: '1995-11-22',
    runtime: 81,
    seasons: null,
    episodes: null,
    genreIds: [10751, 35, 16, 12],
    genres: ['Family', 'Comedy', 'Animation', 'Adventure'],
    language: 'en',
    country: 'US',
    popularity: 875,
    contentRating: 'G',
    youtubeTrailerKey: 'v-PjgYDrg70',
    directors: [],
    cast: [],
  },
  {
    id: 12,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt0266543',
    title: 'Finding Nemo',
    logo: 'https://image.tmdb.org/t/p/w500/gRweHvOoM7hKg3q8iExsXzAhsBv.png',
    overview:
      'Nemo, an adventurous young clownfish, is unexpectedly taken from his Great Barrier Reef home, sparking a massive ocean rescue.',
    poster: 'https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/eCynaAOgYYiw5yN5lBwz3IxqvaW.jpg',
    posterTheme: 'anime',
    score: '7.8',
    voteCount: 19200,
    year: '2003',
    releaseDate: '2003-05-30',
    runtime: 100,
    seasons: null,
    episodes: null,
    genreIds: [16, 10751, 12],
    genres: ['Animation', 'Family', 'Adventure'],
    language: 'en',
    country: 'US',
    popularity: 870,
    contentRating: 'G',
    youtubeTrailerKey: 'wZdpNglLbt8',
    directors: [],
    cast: [],
  },
  {
    id: 8587,
    mediaType: 'movie',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt0110357',
    title: 'The Lion King',
    logo: 'https://image.tmdb.org/t/p/w500/4ldICpAouQAhuT4z3A6tXYMR4Kz.png',
    overview:
      'Young lion prince Simba flees his kingdom after the murder of his father, only to learn the true meaning of responsibility and bravery.',
    poster: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/wXsQvli6tWqja51pYxXNG1LFIGV.jpg',
    posterTheme: 'anime',
    score: '8.3',
    voteCount: 18300,
    year: '1994',
    releaseDate: '1994-06-15',
    runtime: 89,
    seasons: null,
    episodes: null,
    genreIds: [16, 10751, 18],
    genres: ['Animation', 'Family', 'Drama'],
    language: 'en',
    country: 'US',
    popularity: 865,
    contentRating: 'G',
    youtubeTrailerKey: 'lFzVJEksoDY',
    directors: [],
    cast: [],
  },
  // Kids Cartoons & Animated Series
  {
    id: 246,
    mediaType: 'tv',
    category: 'kids',
    isKids: true,
    maturityRating: 'U/A 7+',
    imdbId: 'tt0417299',
    title: 'Avatar: The Last Airbender',
    logo: 'https://image.tmdb.org/t/p/w500/l0zXgxqmIgaHNp1xFAJ6XzCcdD3.png',
    overview:
      'In a war-torn world of elemental magic, a young boy reawakens to undertake a dangerous mystic quest to fulfill his destiny as the Avatar.',
    poster: 'https://image.tmdb.org/t/p/w500/yaGt4GIutpbXHsv48tWceWg6s56.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/7oBGhqJIghRBvOwo5Qe0yM0cnMc.jpg',
    posterTheme: 'anime',
    score: '8.8',
    voteCount: 4100,
    year: '2005',
    releaseDate: '2005-02-21',
    runtime: 24,
    seasons: 3,
    episodes: 61,
    genreIds: [16, 10759, 10765, 10762],
    genres: ['Animation', 'Action & Adventure', 'Kids'],
    language: 'en',
    country: 'US',
    popularity: 950,
    contentRating: 'TV-Y7',
    directors: [],
    cast: [],
  },
  {
    id: 82728,
    mediaType: 'tv',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt7678620',
    title: 'Bluey',
    logo: 'https://image.tmdb.org/t/p/w500/uFYNVaPt6dz1PH6tZ4vfdyOnKS.png',
    overview:
      'Bluey is an inexhaustible six-year-old Blue Heeler dog who turns everyday family life into extraordinary adventures.',
    poster: 'https://image.tmdb.org/t/p/w500/9p4pNoGcuyCfHcGWKNrTopqMWtq.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/tWdNZ3xuFBhJ2ZoQ9vShNGHTb85.jpg',
    posterTheme: 'anime',
    score: '8.6',
    voteCount: 650,
    year: '2018',
    releaseDate: '2018-10-01',
    runtime: 7,
    seasons: 4,
    episodes: 153,
    genreIds: [16, 35, 10751, 10762],
    genres: ['Animation', 'Comedy', 'Family', 'Kids'],
    language: 'en',
    country: 'AU',
    popularity: 935,
    contentRating: 'TV-Y',
    directors: [],
    cast: [],
  },
  {
    id: 387,
    mediaType: 'tv',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt0206512',
    title: 'SpongeBob SquarePants',
    logo: 'https://image.tmdb.org/t/p/w500/imM7dqtVl070IIKyOqzOHmHFXqq.png',
    overview:
      'Deep down in Bikini Bottom lives a square yellow sponge named SpongeBob SquarePants, cooking Krabby Patties and going on wild adventures with Patrick.',
    poster: 'https://image.tmdb.org/t/p/w500/5h0EU2lqBb03dp5vtRuUHJwqzem.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/f3f5OzzYd8m3zN47DAjKs0sbx00.jpg',
    posterTheme: 'anime',
    score: '7.7',
    voteCount: 3000,
    year: '1999',
    releaseDate: '1999-05-01',
    runtime: 22,
    seasons: 18,
    episodes: 661,
    genreIds: [16, 35, 10751, 10762],
    genres: ['Animation', 'Comedy', 'Family', 'Kids'],
    language: 'en',
    country: 'US',
    popularity: 920,
    contentRating: 'TV-Y7',
    directors: [],
    cast: [
      {
        id: 78798,
        name: 'Tom Kenny',
        character: 'SpongeBob (voice)',
        profile: 'https://image.tmdb.org/t/p/w185/kftXtExrcoTTjyeYmSXJ0Ogr3R7.jpg',
      },
    ],
  },
  {
    id: 60572,
    mediaType: 'tv',
    category: 'kids',
    isKids: true,
    maturityRating: 'U',
    imdbId: 'tt0168366',
    title: 'Pokémon',
    logo: 'https://image.tmdb.org/t/p/w500/xvERvRImZQOj83WPj1y3nxPxMDv.png',
    overview:
      'Join Ash accompanied by his partner Pikachu as he travels through many regions, meets new friends, and faces challenges to become a Pokémon Master.',
    poster: 'https://image.tmdb.org/t/p/w500/lP4zwr0F7hWTbAFltfoFTc2AxRG.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/yYpQV25I7XB6S0POJOScPjxYWV5.jpg',
    posterTheme: 'anime',
    score: '8.0',
    voteCount: 2100,
    year: '1997',
    releaseDate: '1997-04-01',
    runtime: 24,
    seasons: 25,
    episodes: 1235,
    genreIds: [16, 10759, 10765, 10762],
    genres: ['Animation', 'Action & Adventure', 'Kids'],
    language: 'ja',
    country: 'JP',
    popularity: 915,
    contentRating: 'TV-Y7',
    directors: [],
    cast: [],
  },
  {
    id: 65334,
    mediaType: 'tv',
    category: 'kids',
    isKids: true,
    maturityRating: 'U/A 7+',
    imdbId: 'tt2580046',
    title: 'Miraculous: Tales of Ladybug & Cat Noir',
    logo: 'https://image.tmdb.org/t/p/w500/drjzvXJirGntkYGRefs2pOapFCM.png',
    overview:
      'Marinette and Adrien, two Parisian teenagers, transform into superheroes Ladybug and Cat Noir to protect Paris from villains.',
    poster: 'https://image.tmdb.org/t/p/w500/acrtAy8gmxcsEvrDP09MpMSCeDZ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/lH22EnM0ofC7GsVGU8dAA2RXV1c.jpg',
    posterTheme: 'anime',
    score: '8.1',
    voteCount: 4400,
    year: '2015',
    releaseDate: '2015-10-19',
    runtime: 22,
    seasons: 7,
    episodes: 181,
    genreIds: [10759, 16, 10762],
    genres: ['Action & Adventure', 'Animation', 'Kids'],
    language: 'fr',
    country: 'FR',
    popularity: 900,
    contentRating: 'TV-Y7',
    directors: [],
    cast: [],
  },
  {
    id: 40075,
    mediaType: 'tv',
    category: 'kids',
    isKids: true,
    maturityRating: 'U/A 7+',
    imdbId: 'tt1865718',
    title: 'Gravity Falls',
    logo: 'https://image.tmdb.org/t/p/w500/WuxO4bgZiarsf7v54Yz7AOptXH.png',
    overview:
      'Twin brother and sister Dipper and Mabel Pines spend the summer helping their great uncle Stan run a tourist trap in mysterious Gravity Falls.',
    poster: 'https://image.tmdb.org/t/p/w500/qwi3p6PzKfQZ4YXBzv3CP5pO2dE.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/l0XvAI856XdyDYEfr1njztjH7u0.jpg',
    posterTheme: 'anime',
    score: '8.6',
    voteCount: 2900,
    year: '2012',
    releaseDate: '2012-06-15',
    runtime: 23,
    seasons: 2,
    episodes: 40,
    genreIds: [16, 10759, 35, 10751, 10762],
    genres: ['Animation', 'Comedy', 'Family', 'Kids'],
    language: 'en',
    country: 'US',
    popularity: 890,
    contentRating: 'TV-Y7',
    directors: [],
    cast: [],
  },
  {
    id: 15260,
    mediaType: 'tv',
    category: 'kids',
    isKids: true,
    maturityRating: 'U/A 7+',
    imdbId: 'tt1305826',
    title: 'Adventure Time',
    logo: 'https://image.tmdb.org/t/p/w500/rIi0lY2UftYuKDJ4OlIefDdijve.png',
    overview:
      'Young Finn and his shape-shifting dog buddy Jake go on wild surreal adventures across the magical Land of Ooo.',
    poster: 'https://image.tmdb.org/t/p/w500/qk3eQ8jW4opJ48gFWYUXWaMT4l.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/d8rse1RgMzXwmZvBpDvcG1VUO2Y.jpg',
    posterTheme: 'anime',
    score: '8.5',
    voteCount: 2800,
    year: '2010',
    releaseDate: '2010-04-05',
    runtime: 11,
    seasons: 10,
    episodes: 279,
    genreIds: [16, 35, 10765, 10762],
    genres: ['Animation', 'Comedy', 'Kids'],
    language: 'en',
    country: 'US',
    popularity: 880,
    contentRating: 'TV-PG',
    directors: [],
    cast: [],
  },
  {
    id: 4686,
    mediaType: 'tv',
    category: 'kids',
    isKids: true,
    maturityRating: 'U/A 7+',
    imdbId: 'tt0760437',
    title: 'Ben 10',
    logo: 'https://image.tmdb.org/t/p/w500/rxbiE1hQO87uoR3IS9viS2KivDL.svg',
    overview:
      'When 10-year-old Ben Tennyson discovers a mysterious watch, he gains the power to transform into ten different alien heroes.',
    poster: 'https://image.tmdb.org/t/p/w500/eogRp6oAPK0SEvQmCrQ78LTlSdp.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/v5hLUEpbn3G3oLXLdF7lFikDivb.jpg',
    posterTheme: 'anime',
    score: '8.1',
    voteCount: 1650,
    year: '2005',
    releaseDate: '2005-12-27',
    runtime: 22,
    seasons: 4,
    episodes: 52,
    genreIds: [16, 10765, 10759, 35, 10762],
    genres: ['Animation', 'Action & Adventure', 'Comedy', 'Kids'],
    language: 'en',
    country: 'US',
    popularity: 875,
    contentRating: 'TV-Y7',
    directors: [],
    cast: [],
  },
];

const BASE_SEEDS_MAP = new Map<string, VaultSeed>();
for (const seed of VAULT_SEEDS) {
  BASE_SEEDS_MAP.set(`${seed.mediaType}:${seed.id}`, seed);
}
for (const extra of EXTRA_PLATFORM_SEEDS) {
  const k = `${extra.mediaType}:${extra.id}`;
  if (!BASE_SEEDS_MAP.has(k)) {
    BASE_SEEDS_MAP.set(k, extra);
  }
}
const ALL_COMBINED_SEEDS: VaultSeed[] = Array.from(BASE_SEEDS_MAP.values());

function stripToSummary(seed: VaultSeed): MediaSummary {
  const {
    imdbId: _i,
    contentRating: _c,
    youtubeTrailerKey: _y,
    directors: _d,
    cast: _ca,
    collection: _co,
    ...summary
  } = seed;
  return summary;
}

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
  return ALL_COMBINED_SEEDS.map(stripToSummary);
}

// Titles exclusive to Netflix vs Prime Video vs Crunchyroll Anime
export const NETFLIX_EXCLUSIVE_IDS = new Set([
  66732,  // Stranger Things
  94605,  // Arcane
  79352,  // Sacred Games
  89113,  // Kota Factory
  93405,  // Squid Game
  71446,  // Money Heist
  119051, // Wednesday
  70523,  // Dark
  545609, // Extraction
  512195, // Red Notice
  661374, // Glass Onion
  725201, // The Gray Man
  1396,   // Breaking Bad (Netflix US/IN classic)
]);

export const PRIME_EXCLUSIVE_IDS = new Set([
  84105,  // Mirzapur
  93352,  // The Family Man
  101352, // Panchayat
  132117, // Farzi
  103051, // Paatal Lok
  124411, // Aspirants
  76479,  // The Boys
  106379, // Fallout
  108978, // Reacher
  95557,  // Invincible
  84773,  // LOTR: Rings of Power
  73375,  // Jack Ryan
  588228, // The Tomorrow War
  937278, // A Man Called Otto
]);

export const CRUNCHYROLL_ANIME_IDS = new Set([
  127532, // Solo Leveling
  1429,   // Attack on Titan
  85937,  // Demon Slayer
  95479,  // Jujutsu Kaisen
  37854,  // One Piece
  114410, // Chainsaw Man
  31910,  // Naruto Shippuden
  120089, // Spy x Family
  13916,  // Death Note
  31911,  // Fullmetal Alchemist: Brotherhood
  88803,  // Vinland Saga
  209867, // Frieren: Beyond Journey's End
  207468, // Kaiju No. 8
  65930,  // My Hero Academia
  46298,  // Hunter x Hunter
  372058, // Your Name.
  129,    // Spirited Away
  810693, // Jujutsu Kaisen 0
  635302, // Demon Slayer: Mugen Train
  916224, // Suzume
  60572,  // Pokemon
  60574,  // JoJo
]);

export function isAnimeMedia(item: MediaSummary): boolean {
  if (!item) return false;
  if (CRUNCHYROLL_ANIME_IDS.has(item.id)) return true;
  if (item.category === 'anime') return true;
  if (item.isKids && item.language !== 'ja') return false;
  const hasAnim =
    (item.genreIds || []).includes(16) ||
    (item.genres || []).some((g) => g.toLowerCase().includes('animation'));
  return Boolean(hasAnim && (item.language === 'ja' || item.country === 'JP'));
}

const BLOCKED_KIDS_IDS = new Set([
  1396, 94605, 127532, 1429, 95479, 105248, 87108, 100088, 66732, 95396, 126308,
  84105, 79352, 93352, 111188, 132117, 103051, 100911, 872906, 864692, 781732,
  538858, 155, 872585, 496243, 414906, 603692, 530385, 807, 550, 76341, 278, 238,
  93405, 71446, 119051, 70523, 545609, 512195, 661374, 725201,
  76479, 106379, 108978, 95557, 84773, 73375, 588228,
]);

const KNOWN_KIDS_IDS = new Set([
  1022789, 324857, 1011985, 862, 12, 8587, 354912, 109445, 519182, 277834, 502356, 315162,
  569094, 246, 387, 60572, 65334, 40075, 15260, 82728, 4686, 150540, 14160, 9806, 260513,
  10681, 8587, 10193, 301528, 49444, 140300, 38055, 10191, 82690, 269149, 508442, 420818,
]);

const UNSAFE_KIDS_GENRE_IDS = new Set([27, 80, 53, 10752]); // Horror, Crime, Thriller, War

export function isKidsSafeMedia(item: MediaSummary): boolean {
  if (!item) return false;
  if (item.isKids) return true;
  if (BLOCKED_KIDS_IDS.has(item.id)) return false;
  if (KNOWN_KIDS_IDS.has(item.id)) return true;

  const rating = String(item.maturityRating || '').toUpperCase();
  if (rating.includes('TV-MA') || rating === 'R' || rating === 'A' || rating.includes('18+')) {
    return false;
  }

  const lowerGenres = (item.genres || []).map((g) => g.toLowerCase());
  if (lowerGenres.some((g) => g.includes('horror') || g.includes('crime') || g.includes('thriller') || g.includes('war'))) {
    return false;
  }
  if ((item.genreIds || []).some((gid) => UNSAFE_KIDS_GENRE_IDS.has(gid))) {
    return false;
  }

  const hasKidsGenre =
    (item.genreIds || []).some((gid) => gid === 16 || gid === 10751 || gid === 10762) ||
    lowerGenres.some((g) => g.includes('animation') || g.includes('family') || g.includes('kids'));

  return hasKidsGenre;
}

export function isAllowedOnPlatform(
  item: MediaSummary,
  platform: StreamingPlatform = 'netflix',
  kidsOnly = false,
): boolean {
  if (!item) return false;
  if (kidsOnly && platform === 'netflix') {
    return isKidsSafeMedia(item);
  }
  if (platform === 'crunchyroll') {
    return isAnimeMedia(item);
  }
  if (platform === 'netflix') {
    if (PRIME_EXCLUSIVE_IDS.has(item.id) || item.exclusiveOn === 'prime') return false;
    return true;
  }
  if (platform === 'prime') {
    if (NETFLIX_EXCLUSIVE_IDS.has(item.id) || item.exclusiveOn === 'netflix') return false;
    return true;
  }
  return true;
}

export function getHeroVaultItems(
  kidsOnly = false,
  platform: StreamingPlatform = 'netflix',
): MediaSummary[] {
  if (platform === 'crunchyroll') {
    return [127532, 1429, 85937, 95479, 209867, 114410]
      .map((id) => ALL_COMBINED_SEEDS.find((s) => s.id === id))
      .filter((s): s is VaultSeed => Boolean(s))
      .map(stripToSummary);
  }
  if (platform === 'prime') {
    return [76479, 106379, 84105, 93352, 108978, 693134]
      .map((id) => ALL_COMBINED_SEEDS.find((s) => s.id === id))
      .filter((s): s is VaultSeed => Boolean(s))
      .map(stripToSummary);
  }
  if (kidsOnly) {
    return ALL_COMBINED_SEEDS.filter((item) => item.isKids)
      .slice(0, 6)
      .map(stripToSummary);
  }
  return [66732, 93405, 872906, 693134, 94605, 157336]
    .map((id) => ALL_COMBINED_SEEDS.find((s) => s.id === id))
    .filter((s): s is VaultSeed => Boolean(s))
    .map(stripToSummary);
}

export function getVaultDetail(id: number, mediaType?: MediaType): MediaDetail | null {
  const found =
    ALL_COMBINED_SEEDS.find((item) => item.id === id && (!mediaType || item.mediaType === mediaType)) ||
    ALL_COMBINED_SEEDS.find((item) => item.id === id);
  if (!found) return null;

  const { collection: col, youtubeTrailerKey, ...rest } = found;
  const recommendations = ALL_COMBINED_SEEDS.filter(
    (other) =>
      other.id !== found.id &&
      (found.isKids ? Boolean(other.isKids) : true) &&
      (other.mediaType === found.mediaType ||
        other.genreIds.some((g) => found.genreIds.includes(g))),
  )
    .slice(0, 12)
    .map(stripToSummary);

  return {
    ...rest,
    recommendations,
    seasonsDetail: buildDefaultSeasons(found),
    trailerEmbedUrl: youtubeTrailerKey
      ? `https://www.youtube.com/embed/${youtubeTrailerKey}?autoplay=1&rel=0`
      : undefined,
    collection: col
      ? {
          id: col.id,
          name: col.name,
          parts: ALL_COMBINED_SEEDS.filter((p) => col.partIds.includes(p.id)).map(stripToSummary),
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
  const platformParam = (params.get('platform') || 'netflix') as StreamingPlatform;
  const curatedSlug = params.get('curatedSlug') || '';
  const kidsOnly = params.get('kids') === '1' || categoryType === 'kids';
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

  let items = ALL_COMBINED_SEEDS.filter((item) => {
    if (!isAllowedOnPlatform(item, platformParam, kidsOnly)) return false;

    if (curatedSlug === 'netflix-exclusives') {
      return NETFLIX_EXCLUSIVE_IDS.has(item.id) || item.exclusiveOn === 'netflix';
    }
    if (curatedSlug === 'prime-originals' || curatedSlug === 'prime-top-series') {
      return (PRIME_EXCLUSIVE_IDS.has(item.id) || item.exclusiveOn === 'prime') && (curatedSlug !== 'prime-top-series' || item.mediaType === 'tv');
    }
    if (curatedSlug === 'prime-hindi-thrillers') {
      return item.language === 'hi' && item.mediaType === 'tv' && !NETFLIX_EXCLUSIVE_IDS.has(item.id);
    }

    if (kidsOnly) {
      if (!isKidsSafeMedia(item)) return false;
      if ((media === 'movie' || media === 'tv') && item.mediaType !== media) return false;
    } else if (platformParam === 'crunchyroll') {
      if (!isAnimeMedia(item)) return false;
      if ((media === 'movie' || media === 'tv') && categoryType !== 'all' && item.mediaType !== media) return false;
    } else if (categoryType === 'all') {
      // Allow all movies & shows for this platform
    } else if (categoryType === 'anime') {
      if (item.category !== 'anime' && !item.genreIds.includes(16)) return false;
    } else if (categoryType === 'hindi') {
      if (item.language !== 'hi' && item.country !== 'IN') return false;
      if (media === 'tv' && item.mediaType !== 'tv') return false;
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

  if (items.length === 0 && !params.get('genres') && !params.get('yearMin') && !params.get('ratingMin')) {
    items = ALL_COMBINED_SEEDS.filter((item) => isAllowedOnPlatform(item, platformParam, kidsOnly));
  }

  items = [...items].sort((a, b) => {
    if (sortBy === 'vote_average.desc') return Number(b.score) - Number(a.score);
    if (sortBy === 'primary_release_date.desc' || sortBy === 'first_air_date.desc' || sortBy === 'date') {
      return b.releaseDate.localeCompare(a.releaseDate);
    }
    if (sortBy === 'revenue.desc') return (b.revenue || 0) - (a.revenue || 0);
    return b.popularity - a.popularity;
  });

  const pageSize = 24;
  const start = (page - 1) * pageSize;
  const sliced = items.slice(start, start + pageSize).map(stripToSummary);

  return {
    list: sliced,
    page,
    total_pages: Math.max(1, Math.ceil(items.length / pageSize)),
    total_results: items.length,
  };
}

export function searchVaultCatalog(
  query: string,
  kidsOnly = false,
  platform: StreamingPlatform = 'netflix',
): {
  results: MediaSummary[];
  people: PersonResult[];
} {
  const q = query.trim().toLowerCase();
  if (!q) return { results: [], people: [] };

  const pool = ALL_COMBINED_SEEDS.filter((item) => isAllowedOnPlatform(item, platform, kidsOnly));

  const results = pool
    .filter(
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
    .map(stripToSummary);

  const peopleMap = new Map<number, PersonResult>();
  if (!kidsOnly) {
    for (const seed of pool) {
      for (const dir of seed.directors) {
        if (dir.name.toLowerCase().includes(q) && !peopleMap.has(dir.id)) {
          peopleMap.set(dir.id, {
            id: dir.id,
            name: dir.name,
            profile: dir.profile || '',
            popularity: 95,
            department: 'Directing',
            knownFor: pool.filter((s) => s.directors.some((d) => d.id === dir.id)).map((s) => s.title),
          });
        }
      }
      for (const actor of seed.cast) {
        if (actor.name.toLowerCase().includes(q) && !peopleMap.has(actor.id)) {
          peopleMap.set(actor.id, {
            id: actor.id,
            name: actor.name,
            profile: actor.profile || '',
            popularity: 88,
            department: 'Acting',
            knownFor: pool.filter((s) => s.cast.some((c) => c.id === actor.id)).map((s) => s.title),
          });
        }
      }
    }
  }

  return { results, people: Array.from(peopleMap.values()) };
}

export function getVaultPerson(id: number): PersonResult | null {
  const credits: MediaSummary[] = [];
  let name = '';
  let department = 'Acting';
  let profile = '';

  for (const seed of ALL_COMBINED_SEEDS) {
    const asDir = seed.directors.find((d) => d.id === id);
    const asCast = seed.cast.find((c) => c.id === id);
    if (asDir || asCast) {
      if (!name) {
        name = asDir ? asDir.name : asCast!.name;
        department = asDir ? 'Directing' : 'Acting';
        profile = (asDir ? asDir.profile : asCast?.profile) || '';
      }
      credits.push(stripToSummary(seed));
    }
  }

  if (!name) return null;

  return {
    id,
    name,
    profile,
    popularity: 92,
    department,
    knownFor: credits.map((c) => c.title),
    biography: `${name} is a celebrated ${department === 'Directing' ? 'filmmaker and director' : 'screen actor'} featured across ${credits.length} acclaimed title${credits.length === 1 ? '' : 's'} in the Dexterx Cenima vault.`,
    credits,
  };
}
