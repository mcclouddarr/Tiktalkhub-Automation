/* eslint-disable */
import { writeFileSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function sample(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function sampleMany(arr, k) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, k);
}
function chance(p) { return Math.random() < p; }
function hashString(len = 8) {
  const chars = 'abcdef0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
function titleCase(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

// Regional configuration
const regions = {
  US: {
    country: 'United States',
    states: [
      'California','Texas','New York','Florida','Illinois','Pennsylvania','Ohio','Georgia','North Carolina','Michigan',
      'Washington','Arizona','Massachusetts','Virginia','New Jersey','Colorado','Tennessee','Indiana','Missouri','Maryland'
    ],
    citiesByState: {
      California: ['Los Angeles','San Diego','San Jose','San Francisco','Sacramento','Fresno','Oakland'],
      Texas: ['Houston','Dallas','Austin','San Antonio','Fort Worth','El Paso'],
      'New York': ['New York','Buffalo','Rochester','Syracuse','Albany'],
      Florida: ['Miami','Orlando','Tampa','Jacksonville','Tallahassee'],
      Illinois: ['Chicago','Aurora','Naperville','Joliet'],
      Pennsylvania: ['Philadelphia','Pittsburgh','Allentown'],
      Ohio: ['Columbus','Cleveland','Cincinnati','Toledo'],
      Georgia: ['Atlanta','Savannah','Augusta'],
      'North Carolina': ['Charlotte','Raleigh','Durham'],
      Michigan: ['Detroit','Grand Rapids','Ann Arbor'],
      Washington: ['Seattle','Spokane','Tacoma'],
      Arizona: ['Phoenix','Tucson','Mesa'],
      Massachusetts: ['Boston','Worcester','Springfield'],
      Virginia: ['Virginia Beach','Norfolk','Arlington'],
      'New Jersey': ['Newark','Jersey City','Paterson'],
      Colorado: ['Denver','Colorado Springs','Aurora'],
      Tennessee: ['Nashville','Memphis','Knoxville'],
      Indiana: ['Indianapolis','Fort Wayne','Evansville'],
      Missouri: ['St. Louis','Kansas City','Springfield'],
      Maryland: ['Baltimore','Annapolis']
    },
    tzs: [
      { code: 'PST', offset: -480 }, { code: 'MST', offset: -420 }, { code: 'CST', offset: -360 }, { code: 'EST', offset: -300 }
    ],
    langs: [['en-US'], ['en-US','es-ES']],
    isps: ['Comcast Xfinity','AT&T','Verizon Fios','Spectrum','Cox Communications','T-Mobile Home Internet'],
    emailDomains: ['gmail.com','outlook.com','yahoo.com'],
    ipFirstOctets: [3,4,8,12,13,15,18,20,23,34,44,45,52,54,63,64,66,67,68,69,70,71,72,73,96,97,98,99,100,104],
  },
  UK: {
    country: 'United Kingdom',
    states: ['England','Scotland','Wales','Northern Ireland'],
    citiesByState: {
      England: ['London','Manchester','Birmingham','Leeds','Liverpool','Bristol','Sheffield'],
      Scotland: ['Edinburgh','Glasgow','Aberdeen','Dundee'],
      Wales: ['Cardiff','Swansea','Newport'],
      'Northern Ireland': ['Belfast','Derry']
    },
    tzs: [{ code: 'GMT', offset: 0 }, { code: 'BST', offset: 60 }],
    langs: [['en-GB']],
    isps: ['BT','Sky Broadband','Virgin Media','TalkTalk'],
    emailDomains: ['gmail.com','outlook.com','yahoo.com'],
    ipFirstOctets: [2,5,31,46,51,62,77,78,79,80,81,82,83,84,85,86,87,88,89,90,109,141,151,176,178,185,212,213],
  },
  Canada: {
    country: 'Canada',
    states: ['Ontario','Quebec','British Columbia','Alberta','Manitoba'],
    citiesByState: {
      Ontario: ['Toronto','Ottawa','Hamilton','London'],
      Quebec: ['Montreal','Quebec City','Laval'],
      'British Columbia': ['Vancouver','Victoria','Surrey'],
      Alberta: ['Calgary','Edmonton','Red Deer'],
      Manitoba: ['Winnipeg','Brandon']
    },
    tzs: [{ code: 'EST', offset: -300 }, { code: 'CST', offset: -360 }, { code: 'MST', offset: -420 }, { code: 'PST', offset: -480 }],
    langs: [['en-CA'], ['fr-CA']],
    isps: ['Bell Canada','Rogers','Telus','Shaw'],
    emailDomains: ['gmail.com','outlook.com','yahoo.com'],
    ipFirstOctets: [24,47,64,65,66,67,68,69,70,71,72,96,99,104,142,144,154,162,192,199,204,205,206,207,209,216],
  },
  Australia: {
    country: 'Australia',
    states: ['New South Wales','Victoria','Queensland','Western Australia'],
    citiesByState: {
      'New South Wales': ['Sydney','Newcastle','Wollongong'],
      Victoria: ['Melbourne','Geelong','Ballarat'],
      Queensland: ['Brisbane','Gold Coast','Cairns'],
      'Western Australia': ['Perth','Fremantle']
    },
    tzs: [{ code: 'AEST', offset: 600 }, { code: 'AEDT', offset: 660 }],
    langs: [['en-AU']],
    isps: ['Telstra','Optus','TPG','Aussie Broadband'],
    emailDomains: ['gmail.com','outlook.com','yahoo.com'],
    ipFirstOctets: [1,14,27,36,42,49,58,60,101,103,110,118,121,122,124,125,139,150,153,171,175,180,182,202,203,210,211,218,220,223],
  },
  Germany: {
    country: 'Germany',
    states: ['Bavaria','Berlin','Hamburg','Hesse','NRW','Saxony'],
    citiesByState: {
      Bavaria: ['Munich','Nuremberg','Augsburg'],
      Berlin: ['Berlin'],
      Hamburg: ['Hamburg'],
      Hesse: ['Frankfurt','Wiesbaden'],
      NRW: ['Cologne','Dusseldorf','Dortmund'],
      Saxony: ['Dresden','Leipzig']
    },
    tzs: [{ code: 'CET', offset: 60 }, { code: 'CEST', offset: 120 }],
    langs: [['de-DE'], ['de-DE','en-GB']],
    isps: ['Deutsche Telekom','Vodafone DE','1&1 Ionos','O2 DE'],
    emailDomains: ['gmail.com','outlook.com','yahoo.com'],
    ipFirstOctets: [2,5,31,37,46,62,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,93,217],
  },
  France: {
    country: 'France',
    states: ['Ile-de-France','Auvergne-Rhône-Alpes','Provence-Alpes-Côte d\'Azur','Nouvelle-Aquitaine'],
    citiesByState: {
      'Ile-de-France': ['Paris','Boulogne-Billancourt','Saint-Denis'],
      'Auvergne-Rhône-Alpes': ['Lyon','Grenoble','Saint-Étienne'],
      'Provence-Alpes-Côte d\'Azur': ['Marseille','Nice','Toulon'],
      'Nouvelle-Aquitaine': ['Bordeaux','Limoges']
    },
    tzs: [{ code: 'CET', offset: 60 }, { code: 'CEST', offset: 120 }],
    langs: [['fr-FR'], ['fr-FR','en-GB']],
    isps: ['Orange','SFR','Bouygues','Free'],
    emailDomains: ['gmail.com','outlook.com','yahoo.com'],
    ipFirstOctets: [2,5,31,37,46,62,77,78,79,80,81,82,83,84,85,86,87,88,89,90,109,151,176,178,185,213],
  },
  Netherlands: {
    country: 'Netherlands',
    states: ['North Holland','South Holland','Utrecht','North Brabant'],
    citiesByState: {
      'North Holland': ['Amsterdam','Haarlem','Alkmaar'],
      'South Holland': ['Rotterdam','The Hague','Leiden'],
      Utrecht: ['Utrecht','Amersfoort'],
      'North Brabant': ['Eindhoven','Tilburg']
    },
    tzs: [{ code: 'CET', offset: 60 }, { code: 'CEST', offset: 120 }],
    langs: [['nl-NL'], ['nl-NL','en-GB']],
    isps: ['KPN','Ziggo','T-Mobile NL'],
    emailDomains: ['gmail.com','outlook.com','yahoo.com'],
    ipFirstOctets: [5,31,37,46,62,77,78,79,80,81,82,83,84,85,86,87,88,89,90,145,145,151,176,178,185,213],
  },
  Sweden: {
    country: 'Sweden',
    states: ['Stockholm County','Västra Götaland','Skåne'],
    citiesByState: {
      'Stockholm County': ['Stockholm','Täby'],
      'Västra Götaland': ['Gothenburg','Borås'],
      Skåne: ['Malmö','Lund']
    },
    tzs: [{ code: 'CET', offset: 60 }, { code: 'CEST', offset: 120 }],
    langs: [['sv-SE'], ['sv-SE','en-GB']],
    isps: ['Telia','Telenor SE','Bahnhof'],
    emailDomains: ['gmail.com','outlook.com','yahoo.com'],
    ipFirstOctets: [5,31,37,46,62,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,95,109,151,176,178,185],
  },
  Spain: {
    country: 'Spain',
    states: ['Madrid','Catalonia','Andalusia','Valencian Community'],
    citiesByState: {
      Madrid: ['Madrid','Alcobendas'],
      Catalonia: ['Barcelona','Tarragona','Girona'],
      Andalusia: ['Seville','Malaga','Granada'],
      'Valencian Community': ['Valencia','Alicante']
    },
    tzs: [{ code: 'CET', offset: 60 }, { code: 'CEST', offset: 120 }],
    langs: [['es-ES'], ['es-ES','en-GB']],
    isps: ['Movistar','Vodafone ES','Orange ES'],
    emailDomains: ['gmail.com','outlook.com','yahoo.com'],
    ipFirstOctets: [5,31,37,46,62,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,95,109,151,176,178,185],
  },
};

const firstNames = {
  generic: ['Emily','Olivia','Sophia','Ava','Isabella','Mia','Amelia','Harper','Evelyn','Abigail','Liam','Noah','Oliver','Elijah','James','William','Benjamin','Lucas','Henry','Alexander','Emma','Charlotte','Daniel','Michael','Jacob','Samuel','Sebastian','Jack','Aiden','Logan','Mason','Ethan','Carter','Wyatt','Grayson','Leo','Jackson'],
  EU: ['Lucas','Luca','Sofia','Emma','Mia','Liam','Noah','Chloe','Thomas','Hugo','Nora','Lea','Pablo','Diego','Mateo','Lucia','Anna','Elsa','Lars','Sven','Johan','Alex','Marie','Leonie','Lena','Hanna','Nils','Finn']
};
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Baker','Nelson'];

const personalities = ['Casual browser','Tech-savvy','Privacy-conscious','Student','Marketer','Researcher','Shopper','Creator'];
const activityPatterns = ['morning','afternoon','night'];
const preferredSites = ['YouTube','Google','Reddit','Twitter','Instagram','Facebook','Amazon','Wikipedia','News','Forums','TikTok','LinkedIn','Medium','StackOverflow'];
const clickBehavior = ['aggressive','normal','light'];

const mobileDevices = [
  { device: 'iPhone 14 Pro', os: 'iOS 17', browser: 'Safari', res: '1170x2532', webgl_vendor: 'Apple Inc.' },
  { device: 'iPhone 15', os: 'iOS 17', browser: 'Safari', res: '1179x2556', webgl_vendor: 'Apple Inc.' },
  { device: 'Samsung Galaxy S23', os: 'Android 14', browser: 'Chrome', res: '1080x2340', webgl_vendor: 'Qualcomm' },
  { device: 'Google Pixel 7', os: 'Android 14', browser: 'Chrome', res: '1080x2400', webgl_vendor: 'ARM' },
  { device: 'OnePlus 11', os: 'Android 14', browser: 'Chrome', res: '1240x2772', webgl_vendor: 'ARM' }
];
const desktopDevices = [
  { device: 'MacBook Pro M1', os: 'macOS 14', browser: 'Chrome', res: '2560x1600', webgl_vendor: 'Apple Inc.' },
  { device: 'MacBook Pro M2', os: 'macOS 14', browser: 'Safari', res: '3024x1964', webgl_vendor: 'Apple Inc.' },
  { device: 'Dell XPS 13', os: 'Windows 11', browser: 'Edge', res: '1920x1200', webgl_vendor: 'Intel Inc.' },
  { device: 'ThinkPad X1 Carbon', os: 'Windows 11', browser: 'Chrome', res: '1920x1080', webgl_vendor: 'Intel Inc.' },
  { device: 'Custom Desktop', os: 'Linux', browser: 'Firefox', res: '2560x1440', webgl_vendor: 'NVIDIA Corporation' }
];
const tabletDevices = [
  { device: 'iPad Pro 12.9', os: 'iPadOS 17', browser: 'Safari', res: '2048x2732', webgl_vendor: 'Apple Inc.' },
  { device: 'Galaxy Tab S8', os: 'Android 14', browser: 'Chrome', res: '1600x2560', webgl_vendor: 'ARM' }
];

const fontsCommon = ['Arial','Helvetica','Times New Roman','Courier New','Verdana','Georgia','Tahoma'];
const fontsApple = ['San Francisco','Helvetica Neue'];
const pluginsWebkit = ['WebKit built-in PDF','QuickTime Plugin'];
const pluginsChrome = ['Chromium PDF Viewer','Widevine Content Decryption Module'];

function makeEmail(name, domain) {
  const normalized = name.toLowerCase().replace(/[^a-z]/g,'');
  const suffix = randInt(10, 9999);
  return `${normalized}${suffix}@${domain}`;
}

function makePassword() {
  const words = ['Sunshine','Ocean','Forest','Skyline','Nebula','River','Summit','Crimson','Indigo','Aurora'];
  const symbols = ['!','@','#','$','%'];
  return `${sample(words)}${symbols[randInt(0, symbols.length-1)]}${randInt(10,99)}`;
}

function ipForRegion(region) {
  const first = sample(region.ipFirstOctets);
  return `${first}.${randInt(0,255)}.${randInt(0,255)}.${randInt(1,254)}`;
}

function deviceProfile() {
  const dice = Math.random();
  if (dice < 0.6) return { type: 'Mobile', ...sample(mobileDevices) };
  if (dice < 0.95) return { type: 'Desktop', ...sample(desktopDevices) };
  return { type: 'Tablet', ...sample(tabletDevices) };
}

function languagesFor(region) { return sample(region.langs); }

function fontsFor(os) {
  if (os.includes('iOS') || os.includes('macOS') || os.includes('iPadOS')) return [...fontsCommon, ...fontsApple];
  return [...fontsCommon];
}

function pluginsFor(browser) {
  if (browser === 'Safari') return [...pluginsWebkit];
  if (browser === 'Firefox') return [];
  return [...pluginsChrome];
}

function connectionFor(type) {
  if (type === 'Mobile') return sample(['Mobile','WiFi']);
  if (type === 'Desktop') return sample(['WiFi','LAN']);
  return sample(['WiFi']);
}

function proxyType() {
  return sample(['Rotating Mobile','Residential Static','Rotating Residential','Datacenter']);
}

function taskGroup() {
  return sample(['Gmail opener','YouTube subscriber','Browsing booster','Searcher','Scroller','Watcher']);
}

function makeName(regionKey) {
  const useEU = ['UK','Germany','France','Netherlands','Sweden','Spain'].includes(regionKey);
  const first = useEU ? sample(firstNames.EU) : sample(firstNames.generic);
  const last = sample(lastNames);
  return `${first} ${last}`;
}

function pickLocation(region) {
  const state = sample(region.states);
  const cities = region.citiesByState[state] || [state];
  const city = sample(cities);
  const tz = sample(region.tzs);
  return { state, city, tz };
}

function personaForRegion(regionKey, region) {
  const name = makeName(regionKey);
  const gender = sample(['Male','Female']);
  const age = randInt(18, 60);
  const { state, city, tz } = pickLocation(region);
  const langs = languagesFor(region);
  const email = makeEmail(name.replace(/\s+/g,''), sample(region.emailDomains));
  const pwd = makePassword();
  const personality = sample(personalities);
  const browsingHours = randInt(1, 10);
  const activity = sample(activityPatterns);
  const preferred = sampleMany(preferredSites, randInt(3,6));
  const click = sample(clickBehavior);
  const dp = deviceProfile();
  const dnt = chance(0.2);
  const touch = dp.type !== 'Desktop' ? true : chance(0.2);
  const hw = dp.type === 'Desktop' ? sample([8,12,16]) : sample([4,6,8]);
  const mem = dp.type === 'Desktop' ? sample([8,16,32]) : sample([3,4,6,8]);
  const webglVendor = dp.webgl_vendor;
  const canvasHash = hashString(8);
  const audioHash = hashString(8);
  const fonts = fontsFor(dp.os);
  const plugins = pluginsFor(dp.browser);
  const ip = ipForRegion(region);
  const isp = sample(region.isps);
  const conn = connectionFor(dp.type);
  const proxy = proxyType();
  const cookieMatched = chance(0.7);
  const proxyMatched = chance(0.8);
  const tg = taskGroup();
  const status = sample(['idle','active','paused','error','idle','active']);

  return {
    persona_id: randomUUID(),
    name,
    gender,
    age,
    country: region.country,
    state,
    city,
    timezone: tz.code,
    language: langs,
    email,
    password: pwd,
    personality,
    browsing_hours_per_day: browsingHours,
    activity_pattern: activity,
    preferred_sites: preferred,
    click_behavior: click,
    device: dp.device,
    device_type: dp.type,
    os: dp.os,
    browser: dp.browser,
    screen_resolution: dp.res,
    webgl_vendor: webglVendor,
    canvas_hash: canvasHash,
    audio_hash: audioHash,
    fonts,
    plugins,
    dnt: dnt,
    timezone_offset: tz.offset,
    languages: langs,
    touch_support: touch,
    hardware_concurrency: hw,
    device_memory: mem,
    ip_address: ip,
    isp,
    connection_type: conn,
    proxy_type: proxy,
    cookie_matched: cookieMatched,
    proxy_matched: proxyMatched,
    task_group: tg,
    status
  };
}

function generate() {
  const targets = [
    { key: 'US', count: 3000 },
    { key: 'UK', count: 500 },
    { key: 'Canada', count: 400 },
    { key: 'Australia', count: 300 },
    { key: 'Germany', count: 250 },
    { key: 'France', count: 200 },
    { key: 'Netherlands', count: 150 },
    { key: 'Sweden', count: 100 },
    { key: 'Spain', count: 100 },
  ];

  const out = [];
  for (const t of targets) {
    const region = regions[t.key];
    for (let i = 0; i < t.count; i++) {
      out.push(personaForRegion(t.key, region));
    }
  }
  return out;
}

const data = generate();
if (data.length !== 5000) {
  throw new Error(`Expected 5000 personas, got ${data.length}`);
}

mkdirSync('data', { recursive: true });
writeFileSync('data/personas.json', JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} personas -> data/personas.json`);