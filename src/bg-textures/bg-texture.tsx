import type { ReactNode } from 'react';

import type { BgTextureVariant } from './bg-texture.type';
import { Dust } from './dust';
import { Grain } from './grain';
import { Halftone } from './halftone';
import { Linen } from './linen';
import { Paper } from './paper';
import { Scanline } from './scanline';

/** A texture over the slide background, under the content. */
export function BgTexture({ variant }: { variant: BgTextureVariant }) {
  const Texture = BG_TEXTURES[variant];
  return <Texture />;
}

const BG_TEXTURES: Record<BgTextureVariant, () => ReactNode> = {
  none: () => null,
  grain: Grain,
  paper: Paper,
  halftone: Halftone,
  linen: Linen,
  dust: Dust,
  scanline: Scanline,
};
