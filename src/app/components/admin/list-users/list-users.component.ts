import {ChangeDetectorRef, Component, HostListener, inject, NgZone, signal} from '@angular/core';
import { UsersService } from '../services/users.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { ListUsersService } from './list-users.service';
import { FormUserComponent } from './form-user/form-user.component';
import { Router } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import {environment} from "../../../../environment";
import {MultiSelectModule} from "primeng/multiselect";
import {toSignal} from "@angular/core/rxjs-interop";
import {AchievementsService} from "../services/achievements.service";

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [TableModule, CommonModule, PaginatorModule, ButtonModule, FormUserComponent, OverlayPanelModule, TagModule, MultiSelectModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent {

  private achievementsService = inject(AchievementsService);

  users: any[] = [];
  selectedUser: any | null = null;
  rowsPerPage = 10;
  page = 0;
  totalUsers = 0;
  sortField = 'id';
  sortOrder = 1;
  isModalVisible: boolean = false; // Для управления видимостью модального окна
  isBanned: boolean = false; // Флаг заблокирован/разблокирован
  banReason: string = '';
  isBanReasonInvalid: boolean = false;
  loading = true;
  isAllCard: boolean = false;
  selectedAchievements = signal([]);
  achievements = toSignal(this.achievementsService.getAchievements());

  isProcessing = false;

  constructor(public usersService: UsersService, private zone: NgZone,  private router: Router,  private cd: ChangeDetectorRef,  public listUsersService: ListUsersService) { }

  ngOnInit() {
    this.page = 0;
    this.loadUsers();
  }

  // onTableScroll(event: any) {
  //   if(!this.isAllCard){
  //     const element = event.target;
  //     const pos = element.scrollTop + element.offsetHeight;
  //     const max = element.scrollHeight;

  //     if (pos >= max - 50 && !this.loading) {
  //       this.page++;
  //       this.loadUsers();
  //     }
  //   }
  // }

  onTableScroll(event: any) {
    if (!this.isAllCard) {
      const element = event.target;
      const pos = element.scrollTop + element.offsetHeight;
      const max = element.scrollHeight;

      if (pos >= max - 50 && !this.loading) {
        this.page++;
        this.loadUsers();
      }
    }
  }


  loadUsers() {
    this.loading = true;
    this.usersService.getFunction(this.page, this.rowsPerPage).subscribe(
      (response: any[]) => {
        if (response.length > 0) {
          const newUsers = response.filter(newUser =>
            !this.users.some(existingUser => existingUser.id === newUser.id)
          );

          this.users = [...(this.users || []), ...newUsers];
          console.log(" response",response)
          console.log(" this.page",this.page)
          // Обновляем представление сразу после изменения данных
          this.cd.detectChanges();


          this.loading = false;
        } else {
          this.loading = false;
          this.isAllCard = true;
        }
      },
      (error: any) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
}


trackByUserId(index: number, user: any): number {
  return user.id;
}


  editUser(user: any) {
    this.selectedUser = user;
    this.listUsersService.visibleForm = true;
  }

  // viewUser(nick: string):string  {
  //   return this.router.createUrlTree([``, nick]).toString();
  // }
  viewUser(nick: string): string {
    return `${environment.mainUrl}/${nick}`;
  }

  selectUser: any;


  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.selectUser = '';
    this.isModalVisible = false;
  }

  setBanDialog(product: any) {
    this.selectUser = product;
    this.openModal()
  }

  banUser() {
    if (this.selectUser.banned === true) {
      this.selectUser.banned = false;
    } else {
      if (this.banReason.trim() === '') {
        this.isBanReasonInvalid = true;
        return;
      } else {
        this.selectUser.banned = true;
        this.selectUser.banReason = this.banReason;
      }
    }

    this.usersService.banUser(this.selectUser);
    this.isBanned = !this.isBanned;
    this.banReason = '';
    this.closeModal();
  }

  validateBanReason() {
    this.isBanReasonInvalid = this.banReason.trim() === '';
  }

  deleteUser(id: string){
    this.usersService.deleteUser(id);
  }

  fillAchievements(userId: number) {
    this.achievementsService.getUserAchievements(userId).subscribe(result => {
      this.selectedAchievements.set(result)
    })
  }

  updateAchievements(user: any, event: any) {
    if (event.originalEvent.selected) {
      console.log('add', event.itemValue);
      this.achievementsService.setUserAchievement(user.id, event.itemValue.id).subscribe(result => {
        console.log(result.message);
      })
    } else {
      this.achievementsService.deleteUserAchievement(user.id, event.itemValue.id).subscribe(result => {
        console.log(result.message);
      })
    }
  }

}
