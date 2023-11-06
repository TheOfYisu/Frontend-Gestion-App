import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { PrivateService } from 'src/app/core/services/private.service';

@Component({
  selector: 'app-select-login',
  templateUrl: './select-login.component.html',
  styleUrls: ['./select-login.component.scss'],
})
export class SelectLoginComponent {
  constructor(
    private AdminService: AdminService,
    private router: Router,
    private PrivateService: PrivateService
  ) {
    this.charge_list_rol();
  }

  list_rol: any;

  selectedRole: string = ''; // Propiedad para almacenar el rol seleccionado

  onContinue() {
    if (this.selectedRole) {
      this.PrivateService.charge_rol_user(Number(this.selectedRole));
      this.router.navigate(['manager/dashboard']);
    } else {
      alert('Por favor, seleccione un rol antes de continuar.');
    }
  }

  async charge_list_rol() {
    const id_userx: any = await localStorage.getItem('id');
    if (id_userx != null || id_userx != '') {
      this.AdminService.get_userxrol_user(id_userx).subscribe((data) => {
        console.log(data);
        const valores = Object.values(data);
        const objetosActivos = valores.filter(
          (objeto: any) => objeto.status === 1
        );
        if (objetosActivos.length > 1) {
          this.list_rol = objetosActivos;
        } else if (objetosActivos.length == 1) {
          this.PrivateService.charge_rol_user(objetosActivos[0].id);
          this.router.navigate(['manager/dashboard']);
        }
      });
    }
  }

  onCancel() {
    // Lógica para cancelar la selección
    // Puedes redirigir a otra página o realizar otras acciones
  }
}
