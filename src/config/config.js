export const PER_PAGE = 10;
export const PER_PAGE_MATCHES = 50;
export const MESSAGE_HIDE_DELAY = 3000;
export const DEFAULT_COORDINATES = [19.3617687, 51.8983513];
export const IMAGES_URL = `${process.env.REACT_APP_API_URL}/images`;
export const DEFAULT_LANGUAGE = 'pl';
export const LANGUAGES = [{
  code: 'pl',
  flag: 'pl.png',
  label: 'Polski',
}, {
  code: 'en',
  flag: 'en.png',
  label: 'English',
}];
export const DOWNLOAD_METHODS = ['90minut', '90minutPucharPolski'];
export const MATCH_DURATION_MINUTES = 120;
export const ATTITUDE_COLOR_UNKNOWN = {
  color: 'black',
  backgroundColor: '#c4c1bb',
};
export const SPORTS = ['football'];

export const ATTITUDE_COLORS = [{
  from: 0,
  to: 10,
  color: 'black',
  backgroundColor: '#c70000',
  label: 'kosa',
  labelExtended: 'Kosa (kibice nienawidzą się)'
}, {
  from: 10,
  to: 30,
  color: 'black',
  backgroundColor: '#b51b1b',
  label: 'wrogie',
  labelExtended: 'Kibice są we wrogich relacjach'
}, {
  from: 30,
  to: 42,
  color: 'black',
  backgroundColor: '#b57f14',
  label: 'antypatia',
  labelExtended: 'Kibice nie lubią się'
}, {
  from: 42,
  to: 47,
  color: 'black',
  backgroundColor: '#edb442',
  label: 'delikatna antypatia',
  labelExtended: 'Kibice nie przepadają za sobą'
}, { // Neutral
  from: 47,
  to: 53,
  color: 'black',
  backgroundColor: '#c4c1bb',
  label: 'neutralne',
  labelExtended: 'Między kibicami panują neutralne relacje'
}, {
  from: 53,
  to: 58,
  color: 'black',
  backgroundColor: '#dff0b1',
  label: 'delikatna sympatia',
  labelExtended: 'Kibice darzą się delikatną sympatią'
}, {
  from: 58,
  to: 66,
  color: 'black',
  backgroundColor: '#a7c25d',
  label: 'sympatia',
  labelExtended: 'Kibice darzą się sympatią'
}, {
  from: 66,
  to: 80,
  color: 'black',
  backgroundColor: '#7f9937',
  label: 'dobre relacje',
  labelExtended: 'Kibice są w dobrych relacjach'
}, {
  from: 80,
  to: 95,
  color: 'black',
  backgroundColor: '#55a61e',
  label: 'układ',
  labelExtended: 'Układ (kibice sa w bardzo dobrych relacjach)'
}, {
  from: 95,
  to: 100,
  color: 'black',
  backgroundColor: '#54cf00',
  label: 'zgoda',
  labelExtended: 'Zgoda (kibice się przyjaźnią)'
}];
export const IMPORTANCE_COLORS = [{
  from: 0,
  to: 1,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.1)',
}, {
  from: 1,
  to: 2,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.25)',
}, {
  from: 2,
  to: 3,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.4)',
}, {
  from: 3,
  to: 4,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.55)',
}, {
  from: 4,
  to: 5,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.7)',
}, { // Neutral
  from: 5,
  to: 6,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.75)',
}, {
  from: 6,
  to: 7,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.8)',
}, {
  from: 7,
  to: 8,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.85)',
}, {
  from: 8,
  to: 9,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.9)',
}, {
  from: 9,
  to: 10,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 0.95)',
}, {
  from: 10,
  to: 100,
  color: 'black',
  backgroundColor: 'rgba(255, 0, 0, 1)',
}];