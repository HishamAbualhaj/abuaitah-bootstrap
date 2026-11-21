import {website} from './website';
import {gallery} from './gallery';

export {website} from './website';
export {gallery} from './gallery';
export const images = {...website, ...gallery} as const;
