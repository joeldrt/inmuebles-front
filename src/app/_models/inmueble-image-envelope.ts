export class InmuebleImageEnvelope {
  constructor(
    public inmueble_id: string,
    public filename: string,
    public filetype: string,
    public value: string,
  ) {
  }
}
