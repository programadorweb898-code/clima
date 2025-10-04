'use client';
import { useContext } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images';
import { LanguageContext } from '@/context/language-context';

export function WorldMapCard() {
  const mapImage = placeholderImages.find((img) => img.id === 'world-map');
  const { translations } = useContext(LanguageContext);
  
  if (!mapImage) return null;

  return (
    <Card className="h-full bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">{translations.globalView}</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Image
            src={mapImage.imageUrl}
            alt={mapImage.description}
            fill
            className="object-cover"
            data-ai-hint={mapImage.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </CardContent>
    </Card>
  );
}
