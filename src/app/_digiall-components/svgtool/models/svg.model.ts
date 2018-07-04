import { Polygon } from './polygon.model';

export class Svg {
    constructor(
        public id?: number,
        public base64Image?: string,
        public width?: number,
        public height?: number,
        public version?: string,
        public polygons?: Polygon[],
    ) {
    }
}
