export class Inmueble {
  constructor(
    public id?: any,
    public fecha_registro?: any,
    public nombre?: string,
    public m2_terreno?: number,
    public m2_construccion?: number,
    public niveles?: number,
    public recamaras?: number,
    public banos?: number,
    public cajones_estacionamiento?: number,
    public amenidades?: string,
    public descripcion?: string,
    public precio_venta?: number,
    public precio_renta?: number,
    public calle?: string,
    public num_exterior?: string,
    public num_interior?: string,
    public colonia?: string,
    public municipio?: string,
    public estado?: string,
    public pais?: string,
    public tags?: [string],
    public fotos?: [string],
  ) {
  }
}
