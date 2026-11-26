import type { CastMember, MediaSummary } from './types';

export interface VaultSeedItem extends MediaSummary {
  imdbId: string;
  contentRating: string;
  youtubeTrailerKey?: string;
  directors: Array<{ id: number; name: string; profile?: string }>;
  cast: CastMember[];
  collection?: { id: number; name: string; partIds: number[] };
}

export const EXTRA_PLATFORM_SEEDS: VaultSeedItem[] = [
  {
    "id": 93405,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "netflix",
    "platforms": [
      "netflix"
    ],
    "imdbId": "tt10919420",
    "title": "Squid Game",
    "logo": "https://image.tmdb.org/t/p/w500/6YFWTX7fiGjWpsnJWLLV4RSbJWd.png",
    "overview": "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
    "poster": "https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/2meX1nMdScFOoV4370rqHWKmXhY.jpg",
    "posterTheme": "noir",
    "score": "7.9",
    "voteCount": 4500,
    "year": "2021",
    "releaseDate": "2021-09-17",
    "runtime": null,
    "seasons": 3,
    "episodes": 22,
    "genreIds": [
      10759,
      9648,
      18
    ],
    "genres": [
      "Action & Adventure",
      "Mystery",
      "Drama"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 71446,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "netflix",
    "platforms": [
      "netflix"
    ],
    "imdbId": "tt6468322",
    "title": "Money Heist",
    "logo": "https://image.tmdb.org/t/p/w500/rYE1Jv1dzoCyjf0oES7L12gwH3D.png",
    "overview": "To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose. Five months of seclusion - memorizing every step, every detail, every probability - culminate in eleven days locked up in the National Coinage and Stamp Factory of Spain, surrounded by police forces and with dozens of hostages in their power, to find out whether their suicide wager will lead to everything or nothing.",
    "poster": "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/xGexTKCJDkl12dTW4YCBDXWb1AD.jpg",
    "posterTheme": "noir",
    "score": "8.2",
    "voteCount": 4500,
    "year": "2017",
    "releaseDate": "2017-05-02",
    "runtime": null,
    "seasons": 5,
    "episodes": 48,
    "genreIds": [
      80,
      18
    ],
    "genres": [
      "Crime",
      "Drama"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 119051,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "netflix",
    "platforms": [
      "netflix"
    ],
    "imdbId": "tt13443470",
    "title": "Wednesday",
    "logo": "https://image.tmdb.org/t/p/w500/2ns0b8dB0wV6Aebe0wI0LBzkoNN.svg",
    "overview": "Smart, sarcastic and a little dead inside, Wednesday Addams investigates twisted mysteries while making new friends — and foes — at Nevermore Academy.",
    "poster": "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
    "posterTheme": "noir",
    "score": "8.3",
    "voteCount": 4500,
    "year": "2022",
    "releaseDate": "2022-11-23",
    "runtime": null,
    "seasons": 3,
    "episodes": 16,
    "genreIds": [
      10765,
      9648,
      35
    ],
    "genres": [
      "Sci-Fi & Fantasy",
      "Mystery",
      "Comedy"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 70523,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "netflix",
    "platforms": [
      "netflix"
    ],
    "imdbId": "tt5753856",
    "title": "Dark",
    "logo": "https://image.tmdb.org/t/p/w500/bV2DiPOCGj3VYtxTK3qS2N6PePI.png",
    "overview": "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
    "poster": "https://image.tmdb.org/t/p/w500/wiiyc3m6HKaQhFBYeuM7ySCNQsG.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/3jDXL4Xvj3AzDOF6UH1xeyHW8MH.jpg",
    "posterTheme": "noir",
    "score": "8.4",
    "voteCount": 4500,
    "year": "2017",
    "releaseDate": "2017-12-01",
    "runtime": null,
    "seasons": 3,
    "episodes": 26,
    "genreIds": [
      80,
      18,
      10765,
      9648
    ],
    "genres": [
      "Crime",
      "Drama",
      "Sci-Fi & Fantasy",
      "Mystery"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 545609,
    "mediaType": "movie",
    "category": "movie",
    "exclusiveOn": "netflix",
    "platforms": [
      "netflix"
    ],
    "imdbId": "tt8936646",
    "title": "Extraction",
    "logo": "https://image.tmdb.org/t/p/w500/8kmF0Eig8czqXY8CHdM5H2rggNR.png",
    "overview": "A hardened gun-for-hire's latest mission becomes a soul-searching race to survive when he's sent into Bangladesh to rescue a drug lord's kidnapped son.",
    "poster": "https://image.tmdb.org/t/p/w500/nygOUcBKPHFTbxsYRFZVePqgPK6.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/2QSZ4CPd8AoljAL76qM30dFft07.jpg",
    "posterTheme": "noir",
    "score": "7.3",
    "voteCount": 4500,
    "year": "2020",
    "releaseDate": "2020-04-23",
    "runtime": 116,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      28,
      53
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 512195,
    "mediaType": "movie",
    "category": "movie",
    "exclusiveOn": "netflix",
    "platforms": [
      "netflix"
    ],
    "imdbId": "tt7991608",
    "title": "Red Notice",
    "logo": "https://image.tmdb.org/t/p/w500/oMoWfoIYfFDr1RGQflEydfbDX7G.png",
    "overview": "An Interpol-issued Red Notice is a global alert to hunt and capture the world's most wanted. But when a daring heist brings together the FBI's top profiler and two rival criminals, there's no telling what will happen.",
    "poster": "https://image.tmdb.org/t/p/w500/lAXONuqg41NwUMuzMiFvicDET9Y.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/p34WRcgkN2QIHcds5FtFiSpV3PC.jpg",
    "posterTheme": "noir",
    "score": "6.7",
    "voteCount": 4500,
    "year": "2021",
    "releaseDate": "2021-11-04",
    "runtime": 118,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      28,
      35,
      80
    ],
    "genres": [
      "Action",
      "Comedy",
      "Crime"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 661374,
    "mediaType": "movie",
    "category": "movie",
    "exclusiveOn": "netflix",
    "platforms": [
      "netflix"
    ],
    "imdbId": "tt11564570",
    "title": "Glass Onion: A Knives Out Mystery",
    "logo": "https://image.tmdb.org/t/p/w500/8sAA3GbGFQqaJYyOCiJD9n0fVDI.png",
    "overview": "World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery surrounding a tech billionaire and his eclectic crew of friends.",
    "poster": "https://image.tmdb.org/t/p/w500/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/y3uOfZAYwLkbvhunswBCskNMrfI.jpg",
    "posterTheme": "noir",
    "score": "7.0",
    "voteCount": 4500,
    "year": "2022",
    "releaseDate": "2022-11-23",
    "runtime": 140,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      35,
      80,
      9648
    ],
    "genres": [
      "Comedy",
      "Crime",
      "Mystery"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 725201,
    "mediaType": "movie",
    "category": "movie",
    "exclusiveOn": "netflix",
    "platforms": [
      "netflix"
    ],
    "imdbId": "tt1649418",
    "title": "The Gray Man",
    "logo": "https://image.tmdb.org/t/p/w500/xoVawJ6i0qDQ8xQ21AjGVYsnSbC.png",
    "overview": "When a shadowy CIA agent uncovers damning agency secrets, he's hunted across the globe by a sociopathic rogue operative who's put a bounty on his head.",
    "poster": "https://image.tmdb.org/t/p/w500/8cXbitsS6dWQ5gfMTZdorpAAzEH.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/2u1YBNBlSwvBReyvI7i5z5ykQXP.jpg",
    "posterTheme": "noir",
    "score": "6.9",
    "voteCount": 4500,
    "year": "2022",
    "releaseDate": "2022-07-13",
    "runtime": 128,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      28,
      53
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 76479,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "prime",
    "platforms": [
      "prime"
    ],
    "imdbId": "tt1190634",
    "title": "The Boys",
    "logo": "https://image.tmdb.org/t/p/w500/xawDgfkBQaocXR9CljBMjkYpXNK.png",
    "overview": "A group of vigilantes known informally as “The Boys” set out to take down corrupt superheroes with no more than blue-collar grit and a willingness to fight dirty.",
    "poster": "https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/bq28ajZaoMyzEIm6REelqyqtEDZ.jpg",
    "posterTheme": "obsidian",
    "score": "8.4",
    "voteCount": 4500,
    "year": "2019",
    "releaseDate": "2019-07-25",
    "runtime": null,
    "seasons": 5,
    "episodes": 40,
    "genreIds": [
      10765,
      10759
    ],
    "genres": [
      "Sci-Fi & Fantasy",
      "Action & Adventure"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 106379,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "prime",
    "platforms": [
      "prime"
    ],
    "imdbId": "tt12637874",
    "title": "Fallout",
    "logo": "https://image.tmdb.org/t/p/w500/kyhbjHomRagzpNEeyKSssbkPWan.png",
    "overview": "The story of haves and have-nots in a world in which there's almost nothing left to have. 200 years after the apocalypse, the gentle denizens of luxury fallout shelters are forced to return to the irradiated hellscape their ancestors left behind — and are shocked to discover an incredibly complex, gleefully weird, and highly violent universe waiting for them.",
    "poster": "https://image.tmdb.org/t/p/w500/c15BtJxCXMrISLVmysdsnZUPQft.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/coaPCIqQBPUZsOnJcWZxhaORcDT.jpg",
    "posterTheme": "obsidian",
    "score": "8.1",
    "voteCount": 4500,
    "year": "2024",
    "releaseDate": "2024-04-10",
    "runtime": null,
    "seasons": 2,
    "episodes": 16,
    "genreIds": [
      10759,
      10765,
      18
    ],
    "genres": [
      "Action & Adventure",
      "Sci-Fi & Fantasy",
      "Drama"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 108978,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "prime",
    "platforms": [
      "prime"
    ],
    "imdbId": "tt9288030",
    "title": "Reacher",
    "logo": "https://image.tmdb.org/t/p/w500/2YkCVT6opPxKh2ogEqxVrCiFgsr.png",
    "overview": "Jack Reacher, a veteran military police investigator, has just recently entered civilian life. Reacher is a drifter, carrying no phone and the barest of essentials as he travels the country and explores the nation he once served.",
    "poster": "https://image.tmdb.org/t/p/w500/f1VCQIG2iCyOookdgOzwtUpwWC0.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/pF0qkRsrHkdYadPWY9AMeFZfcwk.jpg",
    "posterTheme": "obsidian",
    "score": "8.1",
    "voteCount": 4500,
    "year": "2022",
    "releaseDate": "2022-02-03",
    "runtime": null,
    "seasons": 4,
    "episodes": 32,
    "genreIds": [
      10759,
      80
    ],
    "genres": [
      "Action & Adventure",
      "Crime"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 95557,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "prime",
    "platforms": [
      "prime"
    ],
    "imdbId": "tt6741278",
    "title": "INVINCIBLE",
    "logo": "https://image.tmdb.org/t/p/w500/zwJwLPuwx6s0vaVzWEE7EpL1mFd.png",
    "overview": "Mark Grayson is a normal teenager except for the fact that his father is the most powerful superhero on the planet. Shortly after his seventeenth birthday, Mark begins to develop powers of his own and enters into his father's tutelage.",
    "poster": "https://image.tmdb.org/t/p/w500/4tblBrslcKSifMVZ3TmtT2ukMor.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/9qrroces8C6R9aKr08hACNPVXdZ.jpg",
    "posterTheme": "obsidian",
    "score": "8.6",
    "voteCount": 4500,
    "year": "2021",
    "releaseDate": "2021-03-25",
    "runtime": null,
    "seasons": 5,
    "episodes": 40,
    "genreIds": [
      16,
      18,
      10765,
      10759
    ],
    "genres": [
      "Animation",
      "Drama",
      "Sci-Fi & Fantasy",
      "Action & Adventure"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 84773,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "prime",
    "platforms": [
      "prime"
    ],
    "imdbId": "tt7631058",
    "title": "The Lord of the Rings: The Rings of Power",
    "logo": "https://image.tmdb.org/t/p/w500/fA1eS6rfYjS9W8AZbBVG0fpxXn1.png",
    "overview": "Beginning in a time of relative peace, we follow an ensemble cast of characters as they confront the re-emergence of evil to Middle-earth. From the darkest depths of the Misty Mountains, to the majestic forests of Lindon, to the breathtaking island kingdom of Númenor, to the furthest reaches of the map, these kingdoms and characters will carve out legacies that live on long after they are gone.",
    "poster": "https://image.tmdb.org/t/p/w500/bMXWXKM9ydUmMTNvDnYo9QtCBRt.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/uVOcz7JBOuZxsx9IYpx6Ah174LX.jpg",
    "posterTheme": "obsidian",
    "score": "7.2",
    "voteCount": 4500,
    "year": "2022",
    "releaseDate": "2022-09-01",
    "runtime": null,
    "seasons": 3,
    "episodes": 24,
    "genreIds": [
      10759,
      10765
    ],
    "genres": [
      "Action & Adventure",
      "Sci-Fi & Fantasy"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 73375,
    "mediaType": "tv",
    "category": "tv",
    "exclusiveOn": "prime",
    "platforms": [
      "prime"
    ],
    "imdbId": "tt5057054",
    "title": "Tom Clancy's Jack Ryan",
    "logo": "https://image.tmdb.org/t/p/w500/dKygKUvReMAwirwY4Yjn9nnoDej.png",
    "overview": "When CIA analyst Jack Ryan stumbles upon a suspicious series of bank transfers his search for answers pulls him from the safety of his desk job and catapults him into a deadly game of cat and mouse throughout Europe and the Middle East, with a rising terrorist figurehead preparing for a massive attack against the US and her allies.",
    "poster": "https://image.tmdb.org/t/p/w500/cO4py3L3q5GNPrA0qr1wVDrosK1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/2y2TbzeKZHYqTN5gb4nBv9dKk1f.jpg",
    "posterTheme": "obsidian",
    "score": "7.7",
    "voteCount": 4500,
    "year": "2018",
    "releaseDate": "2018-08-30",
    "runtime": null,
    "seasons": 4,
    "episodes": 30,
    "genreIds": [
      10759,
      18
    ],
    "genres": [
      "Action & Adventure",
      "Drama"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 588228,
    "mediaType": "movie",
    "category": "movie",
    "exclusiveOn": "prime",
    "platforms": [
      "prime"
    ],
    "imdbId": "tt9777666",
    "title": "The Tomorrow War",
    "logo": "https://image.tmdb.org/t/p/w500/hby1wdYEbBqRLrccse3IXq0VnFQ.png",
    "overview": "The world is stunned when a group of time travelers arrive from the year 2051 to deliver an urgent message: Thirty years in the future, mankind is losing a global war against a deadly alien species. The only hope for survival is for soldiers and civilians from the present to be transported to the future and join the fight. Among those recruited is high school teacher and family man Dan Forester. Determined to save the world for his young daughter, Dan teams up with a brilliant scientist and his estranged father in a desperate quest to rewrite the fate of the planet.",
    "poster": "https://image.tmdb.org/t/p/w500/34nDCQZwaEvsy4CFO5hkGRFDCVU.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/yizL4cEKsVvl17Wc1mGEIrQtM2F.jpg",
    "posterTheme": "obsidian",
    "score": "7.5",
    "voteCount": 4500,
    "year": "2021",
    "releaseDate": "2021-09-03",
    "runtime": 138,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      28,
      878,
      12
    ],
    "genres": [
      "Action",
      "Science Fiction",
      "Adventure"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 937278,
    "mediaType": "movie",
    "category": "movie",
    "exclusiveOn": "prime",
    "platforms": [
      "prime"
    ],
    "imdbId": "tt7405458",
    "title": "A Man Called Otto",
    "logo": "https://image.tmdb.org/t/p/w500/7wD947mwPtkyoQ8jFZy1Y88ALid.png",
    "overview": "When a lively young family moves in next door, grumpy widower Otto Anderson meets his match in a quick-witted, pregnant woman named Marisol, leading to an unlikely friendship that turns his world upside down.",
    "poster": "https://image.tmdb.org/t/p/w500/130H1gap9lFfiTF9iDrqNIkFvC9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/v2LilmCylr3bL9TCZSj6syjowZh.jpg",
    "posterTheme": "obsidian",
    "score": "7.7",
    "voteCount": 4500,
    "year": "2022",
    "releaseDate": "2022-12-28",
    "runtime": 126,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      35,
      18
    ],
    "genres": [
      "Comedy",
      "Drama"
    ],
    "language": "en",
    "country": "US",
    "popularity": 940,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 85937,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt9335498",
    "title": "Demon Slayer: Kimetsu no Yaiba",
    "logo": "https://image.tmdb.org/t/p/w500/ecghlDeabR3X3Vv8tXIOeXHQvQe.png",
    "overview": "After a demon attack leaves his family slain and his sister cursed, Tanjiro embarks upon a perilous journey to find a cure and avenge those he's lost.",
    "poster": "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/nTvM4mhqNlHIvUkI1gVnW6XP7GG.jpg",
    "posterTheme": "anime",
    "score": "8.6",
    "voteCount": 4500,
    "year": "2019",
    "releaseDate": "2019-04-06",
    "runtime": null,
    "seasons": 5,
    "episodes": 63,
    "genreIds": [
      16,
      10759,
      10765
    ],
    "genres": [
      "Animation",
      "Action & Adventure",
      "Sci-Fi & Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 95479,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt12343534",
    "title": "JUJUTSU KAISEN",
    "logo": "https://image.tmdb.org/t/p/w500/tEmqJ1k4MdjuaKaetn8wGyZGcyC.png",
    "overview": "Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life. One day, to save a classmate who has been attacked by curses, he eats the finger of Ryomen Sukuna, taking the curse into his own soul. From then on, he shares one body with Ryomen Sukuna. Guided by the most powerful of sorcerers, Satoru Gojo, Itadori is admitted to Tokyo Jujutsu High School, an organization that fights the curses... and thus begins the heroic tale of a boy who became a curse to exorcise a curse, a life from which he could never turn back.",
    "poster": "https://image.tmdb.org/t/p/w500/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/gmECX1DvFgdUPjtio2zaL8BPYPu.jpg",
    "posterTheme": "anime",
    "score": "8.6",
    "voteCount": 4500,
    "year": "2020",
    "releaseDate": "2020-10-03",
    "runtime": 24,
    "seasons": 1,
    "episodes": 59,
    "genreIds": [
      16,
      10765,
      10759
    ],
    "genres": [
      "Animation",
      "Sci-Fi & Fantasy",
      "Action & Adventure"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 37854,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt0388629",
    "title": "One Piece",
    "logo": "https://image.tmdb.org/t/p/w500/9F7daAmibx8ZHTE17CdM5FAwiHE.png",
    "overview": "Years ago, the fearsome Pirate King, Gol D. Roger was executed leaving a huge pile of treasure and the famous \"One Piece\" behind. Whoever claims the \"One Piece\" will be named the new King of the Pirates.  Monkey D. Luffy, a boy who consumed a \"Devil Fruit,\" decides to follow in the footsteps of his idol, the pirate Shanks, and find the One Piece. It helps, of course, that his body has the properties of rubber and that he's surrounded by a bevy of skilled fighters and thieves to help him along the way.  Luffy will do anything to get the One Piece and become King of the Pirates!",
    "poster": "https://image.tmdb.org/t/p/w500/dB4EDhre2dsC2kxYDavyKWqLQwi.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/2rmK7mnchw9Xr3XdiTFSxTTLXqv.jpg",
    "posterTheme": "anime",
    "score": "8.8",
    "voteCount": 4500,
    "year": "1999",
    "releaseDate": "1999-10-20",
    "runtime": 24,
    "seasons": 23,
    "episodes": 1180,
    "genreIds": [
      10759,
      35,
      16
    ],
    "genres": [
      "Action & Adventure",
      "Comedy",
      "Animation"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 114410,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt13616990",
    "title": "Chainsaw Man",
    "logo": "https://image.tmdb.org/t/p/w500/8X3AdUA5q3owusAXOiCOn3FwXUa.png",
    "overview": "Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes. This is a far cry from reality, however, as Denji is forced by the yakuza into killing devils in order to pay off his crushing debts. Using his pet devil Pochita as a weapon, he is ready to do anything for a bit of cash.",
    "poster": "https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1OvKcJrWe97.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/fOUKSCbZzaoQKsO39enivHnWDid.jpg",
    "posterTheme": "anime",
    "score": "8.5",
    "voteCount": 4500,
    "year": "2022",
    "releaseDate": "2022-10-12",
    "runtime": 24,
    "seasons": 1,
    "episodes": 12,
    "genreIds": [
      16,
      10759,
      10765
    ],
    "genres": [
      "Animation",
      "Action & Adventure",
      "Sci-Fi & Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 31910,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt0988824",
    "title": "Naruto Shippūden",
    "logo": "https://image.tmdb.org/t/p/w500/qopvxH4C4YIoeJWss0EVLv13rgW.png",
    "overview": "After 2 and a half years Naruto finally returns to his village of Konoha, and sets about putting his ambitions to work. It will not be easy though as he has amassed a few more dangerous enemies, in the likes of the shinobi organization; Akatsuki.",
    "poster": "https://image.tmdb.org/t/p/w500/kV27j3Nz4d5z8u6mN3EJw9RiLg2.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/z0YhJvomqedHF85bplUJEotkN5l.jpg",
    "posterTheme": "anime",
    "score": "8.5",
    "voteCount": 4500,
    "year": "2007",
    "releaseDate": "2007-02-15",
    "runtime": 25,
    "seasons": 20,
    "episodes": 500,
    "genreIds": [
      16,
      10759,
      10765
    ],
    "genres": [
      "Animation",
      "Action & Adventure",
      "Sci-Fi & Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 120089,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt13706018",
    "title": "SPY x FAMILY",
    "logo": "https://image.tmdb.org/t/p/w500/rEWhjQE3KVU6neMkCJ45tz6yh59.svg",
    "overview": "A spy, an assassin and a telepath come together to pose as a family, each for their own reasons, while hiding their true identities from each other.",
    "poster": "https://image.tmdb.org/t/p/w500/7NAvPYPAu7MeHwP8E9sn81PqsRh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/lysUnU6V0VfcthDbviuVlIqgHOR.jpg",
    "posterTheme": "anime",
    "score": "8.5",
    "voteCount": 4500,
    "year": "2022",
    "releaseDate": "2022-04-09",
    "runtime": 24,
    "seasons": 3,
    "episodes": 50,
    "genreIds": [
      16,
      10759,
      35
    ],
    "genres": [
      "Animation",
      "Action & Adventure",
      "Comedy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 13916,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt0877057",
    "title": "Death Note",
    "logo": "https://image.tmdb.org/t/p/w500/mbDyY5qEDKVQNvuHk71OvxH8Cjg.png",
    "overview": "Light Yagami is an ace student with great prospects—and he’s bored out of his mind. But all that changes when he finds the Death Note, a notebook dropped by a rogue Shinigami death god. Any human whose name is written in the notebook dies, and Light has vowed to use the power of the Death Note to rid the world of evil. But will Light succeed in his noble goal, or will the Death Note turn him into the very thing he fights against?",
    "poster": "https://image.tmdb.org/t/p/w500/tCZFfYTIwrR7n94J6G14Y4hAFU6.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/z8IPicmEKXUO4I2UDdMEqw7RqOE.jpg",
    "posterTheme": "anime",
    "score": "8.6",
    "voteCount": 4500,
    "year": "2006",
    "releaseDate": "2006-10-04",
    "runtime": 22,
    "seasons": 1,
    "episodes": 37,
    "genreIds": [
      16,
      9648,
      10765
    ],
    "genres": [
      "Animation",
      "Mystery",
      "Sci-Fi & Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 31911,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt1355642",
    "title": "Fullmetal Alchemist: Brotherhood",
    "logo": "https://image.tmdb.org/t/p/w500/1uxD6336yvySlaNqAuCl5XuGt3U.png",
    "overview": "Disregard for alchemy’s laws ripped half of Edward Elric’s limbs from his body and left his brother Alphonse’s soul clinging to a suit of armor. To restore what was lost, the brothers seek the Philosopher’s Stone. Enemies and allies – the corrupt military, the Homunculi, and foreign alchemists – will alter the Elric brothers course, but their purpose will remain unchanged and their bond unbreakable.",
    "poster": "https://image.tmdb.org/t/p/w500/5ZFUEOULaVml7pQuXxhpR2SmVUw.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/2UG177tWHy7xRmMKWJHB7nAUmKd.jpg",
    "posterTheme": "anime",
    "score": "8.7",
    "voteCount": 4500,
    "year": "2009",
    "releaseDate": "2009-04-05",
    "runtime": null,
    "seasons": 1,
    "episodes": 64,
    "genreIds": [
      16,
      10759,
      10765,
      18
    ],
    "genres": [
      "Animation",
      "Action & Adventure",
      "Sci-Fi & Fantasy",
      "Drama"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 88803,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt10233448",
    "title": "Vinland Saga",
    "logo": "https://image.tmdb.org/t/p/w500/3gRatXdgLfzYU9q9WRwuQaIvpGQ.png",
    "overview": "For a thousand years, the Vikings have made quite a name and reputation for themselves as the strongest families with a thirst for violence. Thorfinn, the son of one of the Vikings' greatest warriors, spends his boyhood in a battlefield enhancing his skills in his adventure to redeem his most-desired revenge after his father was murdered.",
    "poster": "https://image.tmdb.org/t/p/w500/vUHlpA5c1NXkds59reY3HMb4Abs.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/sPN7Ylc7swmyukJeQBNcRAl9usS.jpg",
    "posterTheme": "anime",
    "score": "8.5",
    "voteCount": 4500,
    "year": "2019",
    "releaseDate": "2019-07-08",
    "runtime": 25,
    "seasons": 2,
    "episodes": 48,
    "genreIds": [
      16,
      10768,
      10759,
      18
    ],
    "genres": [
      "Animation",
      "War & Politics",
      "Action & Adventure",
      "Drama"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 209867,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt22248376",
    "title": "Frieren: Beyond Journey's End",
    "logo": "https://image.tmdb.org/t/p/w500/yQuc8JcBxRWXfRHrNUSM47gCXOo.png",
    "overview": "After the party of heroes defeated the Demon King, they restored peace to the land and returned to lives of solitude. Generations pass, and the elven mage Frieren comes face to face with humanity's mortality. She takes on a new apprentice and promises to fulfill old friends' dying wishes. Can an elven mind make peace with the nature of life and death? Frieren embarks on her quest to find out.",
    "poster": "https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg",
    "posterTheme": "anime",
    "score": "8.8",
    "voteCount": 4500,
    "year": "2023",
    "releaseDate": "2023-09-29",
    "runtime": 25,
    "seasons": 1,
    "episodes": 38,
    "genreIds": [
      16,
      10759,
      18,
      10765
    ],
    "genres": [
      "Animation",
      "Action & Adventure",
      "Drama",
      "Sci-Fi & Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 207468,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt21975436",
    "title": "Kaiju No. 8",
    "logo": "https://image.tmdb.org/t/p/w500/3LLPafM7SMSaFzxdy3Pdy1kQGe4.svg",
    "overview": "In a world plagued by creatures known as Kaiju, Kafka Hibino aspired to enlist in The Defense Force. He makes a promise to enlist with his childhood friend, Mina Ashiro. Soon, life takes them in separate ways. While employed cleaning up after Kaiju battles, Kafka meets Reno Ichikawa. Reno's determination to join The Defense Force reawakens Kafka's promise to join Mina and protect humanity.",
    "poster": "https://image.tmdb.org/t/p/w500/83yDUQVpdhv8ePy3nbTRzFaKYuQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/htGeuCcNhlBe8GTx3izKOsd8frw.jpg",
    "posterTheme": "anime",
    "score": "8.4",
    "voteCount": 4500,
    "year": "2024",
    "releaseDate": "2024-04-13",
    "runtime": 24,
    "seasons": 1,
    "episodes": 23,
    "genreIds": [
      16,
      10759,
      10765
    ],
    "genres": [
      "Animation",
      "Action & Adventure",
      "Sci-Fi & Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 65930,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt5626028",
    "title": "My Hero Academia",
    "logo": "https://image.tmdb.org/t/p/w500/ztteKox6S97uwEuEF2lsaFxaJmg.png",
    "overview": "Izuku has dreamt of being a hero all his life—a lofty goal for anyone, but especially challenging for a kid with no superpowers. That’s right, in a world where eighty percent of the population has some kind of super-powered \"quirk,\" Izuku was unlucky enough to be born completely normal. But that’s not enough to stop him from enrolling in one of the world’s most prestigious hero academies.",
    "poster": "https://image.tmdb.org/t/p/w500/phuYuzqWW9ru8EA3HVjE9W2Rr3M.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/3ILMlmC30QUnYkY3XEBOyJ82Dqu.jpg",
    "posterTheme": "anime",
    "score": "8.6",
    "voteCount": 4500,
    "year": "2016",
    "releaseDate": "2016-04-03",
    "runtime": 24,
    "seasons": 8,
    "episodes": 170,
    "genreIds": [
      10759,
      16,
      10765
    ],
    "genres": [
      "Action & Adventure",
      "Animation",
      "Sci-Fi & Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 46298,
    "mediaType": "tv",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt2098220",
    "title": "Hunter x Hunter",
    "logo": "https://image.tmdb.org/t/p/w500/jTzF5T8Ob6oZRinUCnhbLqrxFsM.png",
    "overview": "Gon, a young boy who lives on Whale Island, dreams of becoming a Hunter like his father, who left when Gon was still young.",
    "poster": "https://image.tmdb.org/t/p/w500/i2EEr2uBvRlAwJ8d8zTG2Y19mIa.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/bFKKyCI89Xq98Gul8cGox8K3sZa.jpg",
    "posterTheme": "anime",
    "score": "8.7",
    "voteCount": 4500,
    "year": "2011",
    "releaseDate": "2011-10-02",
    "runtime": 24,
    "seasons": 3,
    "episodes": 148,
    "genreIds": [
      16,
      10759,
      10765
    ],
    "genres": [
      "Animation",
      "Action & Adventure",
      "Sci-Fi & Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "TV-14",
    "directors": [],
    "cast": []
  },
  {
    "id": 372058,
    "mediaType": "movie",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt5311514",
    "title": "Your Name.",
    "logo": "https://image.tmdb.org/t/p/w500/zKI7UKmsB5ywy6Rjs3wWvBfhafJ.png",
    "overview": "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki’s body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other.",
    "poster": "https://image.tmdb.org/t/p/w500/vfJFJPepRKapMd5G2ro7klIRysq.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg",
    "posterTheme": "anime",
    "score": "8.5",
    "voteCount": 4500,
    "year": "2016",
    "releaseDate": "2016-07-01",
    "runtime": 106,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      16,
      10749,
      18
    ],
    "genres": [
      "Animation",
      "Romance",
      "Drama"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 129,
    "mediaType": "movie",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt0245429",
    "title": "Spirited Away",
    "logo": "https://image.tmdb.org/t/p/w500/hkUi1Z15Ymj9GNamWQkzUhehLuy.png",
    "overview": "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    "poster": "https://image.tmdb.org/t/p/w500/jUo8cNmU400WtZiJss45HNXlQ2e.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/dyJvKsNs2KP8qQnAXbRwDjblViy.jpg",
    "posterTheme": "anime",
    "score": "8.5",
    "voteCount": 4500,
    "year": "2001",
    "releaseDate": "2001-07-20",
    "runtime": 125,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      16,
      10751,
      14,
      12
    ],
    "genres": [
      "Animation",
      "Family",
      "Fantasy",
      "Adventure"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 810693,
    "mediaType": "movie",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt14331144",
    "title": "Jujutsu Kaisen 0",
    "logo": "https://image.tmdb.org/t/p/w500/4clQNTdrIUFJAFTIpguGwO2ldgi.png",
    "overview": "Yuta Okkotsu is a nervous high school student who is suffering from a serious problem—his childhood friend Rika has turned into a curse and won't leave him alone. Since Rika is no ordinary curse, his plight is noticed by Satoru Gojo, a teacher at Jujutsu High, a school where fledgling exorcists learn how to combat curses. Gojo convinces Yuta to enroll, but can he learn enough in time to confront the curse that haunts him?",
    "poster": "https://image.tmdb.org/t/p/w500/23oJaeBh0FDk2mQ2P240PU9Xxfh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/rcEDPOOOUTLFxLLQJggfLffbofe.jpg",
    "posterTheme": "anime",
    "score": "8.1",
    "voteCount": 4500,
    "year": "2021",
    "releaseDate": "2021-12-24",
    "runtime": 105,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      16,
      28,
      14
    ],
    "genres": [
      "Animation",
      "Action",
      "Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 635302,
    "mediaType": "movie",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt11032374",
    "title": "Demon Slayer -Kimetsu no Yaiba- The Movie: Mugen Train",
    "logo": "https://image.tmdb.org/t/p/w500/xhPL1PDIweY7WTHC4fwGYgtGzvU.png",
    "overview": "Tanjiro Kamado, joined with Inosuke Hashibira, a boy raised by boars who wears a boar's head, and Zenitsu Agatsuma, a scared boy who reveals his true power when he sleeps, boards the Infinity Train on a new mission with the Fire Hashira, Kyojuro Rengoku, to defeat a demon who has been tormenting the people and killing the demon slayers who oppose it!",
    "poster": "https://image.tmdb.org/t/p/w500/h8Rb9gBr48ODIwYUttZNYeMWeUU.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/qjGrUmKW78MCFG8PTLDBp67S27p.jpg",
    "posterTheme": "anime",
    "score": "8.2",
    "voteCount": 4500,
    "year": "2020",
    "releaseDate": "2020-10-16",
    "runtime": 117,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      16,
      28,
      14
    ],
    "genres": [
      "Animation",
      "Action",
      "Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  },
  {
    "id": 916224,
    "mediaType": "movie",
    "category": "anime",
    "exclusiveOn": "crunchyroll",
    "platforms": [
      "crunchyroll",
      "netflix"
    ],
    "imdbId": "tt16428256",
    "title": "Suzume",
    "logo": "https://image.tmdb.org/t/p/w500/q543yE9gmhqbMkVUtwE0YzRFMzO.png",
    "overview": "Suzume, 17, lost her mother as a little girl. On her way to school, she meets a mysterious young man. But her curiosity unleashes a calamity that endangers the entire population of Japan, and so Suzume embarks on a journey to set things right.",
    "poster": "https://image.tmdb.org/t/p/w500/yStW1TXF5s7Tbtu9KjIZEaWl6HL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/4tdV5AeojEdbvn6VpeQrbuDlmzs.jpg",
    "posterTheme": "anime",
    "score": "7.9",
    "voteCount": 4500,
    "year": "2022",
    "releaseDate": "2022-11-11",
    "runtime": 122,
    "seasons": null,
    "episodes": null,
    "genreIds": [
      16,
      18,
      12,
      14
    ],
    "genres": [
      "Animation",
      "Drama",
      "Adventure",
      "Fantasy"
    ],
    "language": "ja",
    "country": "JP",
    "popularity": 930,
    "contentRating": "PG-13",
    "directors": [],
    "cast": []
  }
];
