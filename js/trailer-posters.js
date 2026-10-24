document.addEventListener('click', function(event) {
  const button = event.target.closest('.trailer-play');
  if (!button) return;
  const box = button.closest('.trailer-poster');
  if (button.dataset.localVideo) {const video = document.createElement('video');video.src = button.dataset.localVideo;video.controls = true;video.autoplay = true;video.playsInline = true;video.preload = 'metadata';video.style.width = '100%';video.style.height = '100%';video.style.objectFit = 'contain';box.replaceChildren(video);box.classList.add('trailer-playing');return;}const iframe = document.createElement('iframe');
  iframe.src = button.dataset.embed + (button.dataset.embed.includes('?') ? '&' : '?') + 'autoplay=1';
  iframe.title = 'Trailer do filme';
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;
  box.replaceChildren(iframe);
  box.classList.add('trailer-playing');
});
