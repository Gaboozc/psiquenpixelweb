const YoutubeEmbed = ({ videoId, title = 'YouTube video' }) => (
  <div className="relative w-full aspect-video pixel-border overflow-hidden">
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
      loading="lazy"
    />
  </div>
);

export default YoutubeEmbed;
