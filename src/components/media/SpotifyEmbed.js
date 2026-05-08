// type: 'show' | 'episode' | 'playlist' | 'track'
const SpotifyEmbed = ({ spotifyId, type = 'show', title = 'Spotify player' }) => (
  <div className="w-full pixel-border overflow-hidden">
    <iframe
      src={`https://open.spotify.com/embed/${type}/${spotifyId}`}
      title={title}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="w-full"
      style={{ minHeight: type === 'show' ? '232px' : '152px', border: 'none' }}
    />
  </div>
);

export default SpotifyEmbed;
