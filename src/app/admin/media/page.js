import { getMedia } from '@/lib/media';
import MediaEditor from '@/components/admin/MediaEditor';

export default async function AdminMediaPage() {
  const media = await getMedia();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Media</h1>
        <p className="text-brand-muted text-sm font-body">
          Textos, características y embeds de las secciones de YouTube y Spotify. Los enlaces de canal se editan en Ajustes.
        </p>
      </div>
      <MediaEditor initial={media} />
    </div>
  );
}
