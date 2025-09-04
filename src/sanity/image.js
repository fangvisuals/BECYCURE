import imageUrlBuilder from '@sanity/image-url';
import {sanity} from './client';

const builder = imageUrlBuilder(sanity);
export const urlFor = (src) => (src ? builder.image(src) : null);
