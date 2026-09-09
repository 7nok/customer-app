import { Image, type ImageContentPosition, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

import { HERO_IMAGE, HERO_IMAGE_ALT } from '@/constants/media';

/** Full-bleed or framed hero. Change the asset in `constants/media.ts` only. */
export function HeroImage({
  style,
  contentPosition = 'center',
}: {
  style?: StyleProp<ImageStyle>;
  contentPosition?: ImageContentPosition;
}) {
  return (
    <Image
      source={HERO_IMAGE}
      style={style}
      contentFit="cover"
      contentPosition={contentPosition}
      accessibilityLabel={HERO_IMAGE_ALT}
      transition={250}
    />
  );
}
