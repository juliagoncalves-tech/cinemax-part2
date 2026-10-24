document.addEventListener('DOMContentLoaded', () => {
  if (typeof Plyr === 'undefined') {
    console.warn('Não foi possível carregar a biblioteca Plyr.');
    return;
  }
  const players = Plyr.setup('.plyr-video', {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
    youtube: { noCookie: false, rel: 0, playsinline: 1 },
    ratio: '16:9'
  });
  players.forEach(player => {
    player.on('play', () => players.forEach(other => { if (other !== player) other.pause(); }));
  });
});
