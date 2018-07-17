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

  refresh_already_performed = false;

  inmueble_images: Inmueble;
  image_envelopes: InmuebleImageEnvelope[];
  uploading_images = false;
  images_position_change = false;

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
    this.clearInmuebleImagesId();
    this.inmueble_images = inmueble_images;
  }

  clearInmuebleImagesId() {
    this.inmueble_images = null;
    this.image_envelopes = new Array<InmuebleImageEnvelope>();
    this.uploading_images = false;
    this.images_position_change = false;
  }

  setNewInmuebleObject() {
    this.current_inmueble = new Inmueble();
  }

  setEditInmuebleObject(inmueble: Inmueble) {
    this.current_inmueble = Object.assign({}, inmueble);
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
        if ((error.status === 401 || error.status === 500) && this.accountService.isAccountPresent()) {
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
        if ((error.status === 401 || error.status === 500)
          && this.accountService.isAccountPresent()
          && !this.refresh_already_performed) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            this.refresh_already_performed = false;
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          this.refresh_already_performed = true;
          refreshcall.subscribe(
            value1 => {
              // call method again after refreshing token
              this.save();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.refresh_already_performed = false;
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
        if ((error.status === 401 || error.status === 500)
          && this.accountService.isAccountPresent()
          && !this.refresh_already_performed) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            this.refresh_already_performed = false;
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          this.refresh_already_performed = true;
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
          this.refresh_already_performed = false;
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.image_envelopes = new Array<InmuebleImageEnvelope>();
      for (let index = 0; index < event.target.files.length; index++) {
        const reader = new FileReader();
        const file = event.target.files[index];
        reader.readAsDataURL(file);
        reader.onload = () => {
          const image_envelope = new InmuebleImageEnvelope(
            file.name,
            file.type,
            reader.result.split(',')[1]
          );
          this.image_envelopes.push(image_envelope);
        };
      }
    }
  }

  uploadImages() {
    if (this.image_envelopes.length <= 0) {
      return;
    }
    this.uploading_images = true;
    this.imagenService.upload(this.image_envelopes, this.inmueble_images.id).subscribe(
      (value: HttpResponse<any>) => {
        this.image_input_field.nativeElement.value = '';
        // this.toasterService.success('Foto guardada'); # issue flicker
        for (let index = 0; index < value.body.message.length; index++) {
          this.inmueble_images.fotos.push(value.body.message[index]);
        }
        this.image_envelopes = new Array<InmuebleImageEnvelope>();
        this.uploading_images = false;
      },
      (error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 500) && this.accountService.isAccountPresent()) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            // nothing to do... we must perform a login... redirect to it
            this.uploading_images = false;
            this.router.navigate(['/login']);
          }
          refreshcall.subscribe(
            value => {
              // call method again after refreshing token
              this.uploadImages();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.uploading_images = false;
              this.router.navigate(['/login']);
            });
        } else {
          this.uploading_images = false;
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
        // this.toasterService.success('Foto borrada'); # issue flicker
      },
      (error) => {
        if ((error.status === 401 || error.status === 500) && this.accountService.isAccountPresent()) {
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

  isFirstImage(position: number): boolean {
    return position === 0;
  }

  isLastImage(position: number): boolean {
    if (this.inmueble_images && this.inmueble_images.fotos) {
      return position >= this.inmueble_images.fotos.length - 1;
    }
    return false;
  }

  swtichImage(position: number, action: number) {
    // action 0: prev 1: next
    if (action === 0) {
      if (this.isFirstImage(position)) {
        // nothing to do
        return;
      }
      this.images_position_change = true;
      const temp_value = this.inmueble_images.fotos[position - 1];
      this.inmueble_images.fotos[position - 1] = this.inmueble_images.fotos[position];
      this.inmueble_images.fotos[position] = temp_value;
    }
    if (action === 1) {
      if (this.isLastImage(position)) {
        // nothing to do
        return;
      }
      this.images_position_change = true;
      const temp_value = this.inmueble_images.fotos[position + 1];
      this.inmueble_images.fotos[position + 1] = this.inmueble_images.fotos[position];
      this.inmueble_images.fotos[position] = temp_value;
    }
  }

  saveImagePositionChanged() {
    if (!this.images_position_change) {
      return;
    }
    if (this.inmueble_images && this.inmueble_images.fotos) {
      this.imagenService.updateList(this.inmueble_images.fotos, this.inmueble_images.id).subscribe(
        (value) => {
          this.images_position_change = false;
          this.toasterService.success('El orden de las fotos fue guardado');
        },
        (error) => {
          if ((error.status === 401 || error.status === 500) && this.accountService.isAccountPresent()) {
            const refreshcall = this.authenticationService.refreshAccessToken();
            if (refreshcall === null) {
              this.images_position_change = false;
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            }
            refreshcall.subscribe(
              value => {
                // call method again after refreshing token
                this.saveImagePositionChanged();
              },
              (errorRefresh: HttpErrorResponse) => {
                this.images_position_change = false;
                // nothing to do... we must perform a login... redirect to it
                this.router.navigate(['/login']);
              });
          } else {
            this.images_position_change = false;
            this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
          }
        });
    }
  }
}
