import Image from 'next/image';
import { MapPin } from 'lucide-react';
import imageManifest from '../data/municipality-images.json';

type Entry = { name: string };
type Photo = (typeof imageManifest.results)[number]['image'];

export default function MunicipalityVisual({ municipality, image, priority = false }: {
  municipality: Entry;
  image?: Photo;
  priority?: boolean;
}) {
  if (image) {
    return <div className="municipality-visual-photo">
      <Image src={image.imageUrl} alt={image.alt} fill sizes="(max-width: 760px) 92vw, 48vw" unoptimized priority={priority} />
      <MunicipalityImageCredits image={image} />
    </div>;
  }

  return <div className="municipality-visual-silhouette" role="img" aria-label={`Imagem territorial indisponível para ${municipality.name}`}>
    <MapPin aria-hidden="true" />
    <span>{municipality.name}</span>
  </div>;
}

export function MunicipalityImageCredits({ image }: { image?: Photo }) {
  if (!image) return null;
  return <details className="municipality-image-credits">
    <summary aria-label="Mostrar créditos da imagem">Créditos</summary>
    <p>Fotografia · {image.credit} · {image.license} · <a href={image.sourceUrl} target="_blank" rel="noreferrer">Ver origem ↗</a></p>
  </details>;
}

export function getMunicipalityImage(id: string | null): Photo {
  return imageManifest.results.find(item => item.ibgeCode === id)?.image ?? null;
}
