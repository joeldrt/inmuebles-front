export class Image {
    constructor(
        public srcB64? : string,
        public name? : string,
        public size? : number,
        public type? : string,
        public originalWidth? : number,
        public originalHeight? : number,
        public widthContent? : number,
        public heightContent? : number
    ){}
}