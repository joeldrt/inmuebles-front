import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Inmueble } from '../../../_models';
import { InmuebleService, AccountService, AuthenticationService, ImagenService } from '../../../_services';
import { ToasterService } from '../../../_services/toaster.service';
import { InmuebleImageEnvelope } from '../../../_models/inmueble-image-envelope';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.scss', ]
})
export class InmueblesComponent implements OnInit {
  image_resource_url_base: string;

  @ViewChild('image_input_field') image_input_field: ElementRef;
  inmueble_modal_window: NgbModalRef;
  current_inmueble: Inmueble;
  inmueble_modal_type: string;

  inmueble_images: Inmueble;
  image_envelope: InmuebleImageEnvelope;

  inmuebles: Inmueble[];

  inmueble_borrar_id: string;
  inmueble_borrar_nombre: string;

  loading = false;

  constructor(
    private inmuebleService: InmuebleService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private toasterService: ToasterService,
    private router: Router,
    private modalService: NgbModal,
    private imagenService: ImagenService,
  ) {
    this.current_inmueble = new Inmueble();
    this.image_resource_url_base = environment.API_URL;
  }

  ngOnInit() {
    this.findAll();
  }

  reload() {
    this.findAll();
  }

  private findAll() {
    this.loading = true;
    this.inmuebleService.getAll().subscribe(
      (response: HttpResponse<Inmueble[]>) => {
        this.inmuebles = response.body;
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.toasterService.error('Error de conexión');
        }
        this.loading = false;
      });
  }

  setIdToDelete(inmueble_id: string, inmueble_nombre: string) {
    this.inmueble_borrar_id = inmueble_id;
    this.inmueble_borrar_nombre = inmueble_nombre;
  }

  clearIdToDelete() {
    this.inmueble_borrar_id = null;
    this.inmueble_borrar_nombre = null;
  }

  setInmuebleImagesId(inmueble_images: Inmueble) {
    this.inmueble_images = inmueble_images;
  }

  clearInmuebleImagesId() {
    this.inmueble_images = null;
  }

  setNewInmuebleObject() {
    this.current_inmueble = new Inmueble();
  }

  setEditInmuebleObject(inmueble: Inmueble) {
    this.current_inmueble = inmueble;
  }

  openInmuebleModal(content: any, inmueble?: Inmueble) {
    if (!inmueble) {
      this.setNewInmuebleObject();
      this.inmueble_modal_type = 'new';
    } else {
      this.setEditInmuebleObject(inmueble);
      this.inmueble_modal_type = 'edit';
    }
    this.inmueble_modal_window = this.modalService.open(content, { windowClass: 'in', backdropClass: 'digiallbackdrop'});
  }

  closeInmuebleModal() {
    if (this.inmueble_modal_window) {
      this.setNewInmuebleObject();
      this.inmueble_modal_window.close();
    }
  }

  edit() {
    this.inmuebleService.update(this.current_inmueble).subscribe(
      (value1: HttpResponse<Inmueble>) => {
        this.findAll();
        this.setNewInmuebleObject();
        this.toasterService.success('Inmueble editado correctamente');
        this.closeInmuebleModal();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401 && this.accountService.isAccountPresent()) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          refreshcall.subscribe(
            value1 => {
              // call method again after refreshing token
              this.toasterService.warning('Intenta guardar nuevamente');
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }

      });
  }

  save() {
    this.inmuebleService.create(this.current_inmueble).subscribe(
      (value1: HttpResponse<Inmueble>) => {
        this.findAll();
        this.setNewInmuebleObject();
        this.toasterService.success('Inmueble creado');
        this.closeInmuebleModal();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401 && this.accountService.isAccountPresent()) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          refreshcall.subscribe(
            value1 => {
              // call method again after refreshing token
              this.toasterService.warning('Intenta guardar nuevamente');
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }

  delete() {
    if (!this.inmueble_borrar_id) {
      return;
    }
    this.inmuebleService.delete(this.inmueble_borrar_id).subscribe(
      (response) => {
        this.findAll();
        this.clearIdToDelete();
        this.toasterService.success('El inmueble fue borrado correctamente');
      },
      (error: HttpErrorResponse) => {
        // we add also status 500, because thats the status number when raising ExpiredSignatureError('Signature has expired')
        if ((error.status === 401 || error.status === 500) && this.accountService.isAccountPresent()) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          refreshcall.subscribe(
            value => {
              // call method again after refreshing token
              this.delete();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image_envelope = new InmuebleImageEnvelope(
          this.inmueble_images.id,
          file.name,
          file.type,
          reader.result.split(',')[1]
        );
      };
    }
  }

  saveImage() {
    if (!this.image_envelope) {
      return;
    }
    this.imagenService.upload(this.image_envelope).subscribe(
      (value: HttpResponse<any>) => {
        this.image_input_field.nativeElement.value = '';
        this.toasterService.success('Foto guardada');
        this.inmueble_images.fotos.push(value.body.message);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401 && this.accountService.isAccountPresent()) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          refreshcall.subscribe(
            value => {
              // call method again after refreshing token
              this.saveImage();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }

  removeImage(inmueble_id: string, source_url: string) {
    this.imagenService.delete(inmueble_id, source_url).subscribe(
      (value) => {
        const index = this.inmueble_images.fotos.indexOf(source_url, 0);
        if (index > -1) {
          this.inmueble_images.fotos.splice(index, 1);
        }
        this.toasterService.success('Foto borrada');
      },
      (error) => {
        if (error.status === 401 && this.accountService.isAccountPresent()) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          refreshcall.subscribe(
            value => {
              // call method again after refreshing token
              this.removeImage(inmueble_id, source_url);
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }
}
