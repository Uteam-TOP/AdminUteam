import {ChangeDetectorRef, Component, HostListener, inject, Input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {DatePipe, NgIf} from "@angular/common";
import {FormsComponent} from "../../components/admin/list-cards/forms/forms.component";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MultiSelectModule} from "primeng/multiselect";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {PaginatorModule} from "primeng/paginator";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {RouterLink} from "@angular/router";
import {environment} from "../../../environment";

@Component({
  selector: 'app-list-table',
  standalone: true,
  imports: [
    Button,
    DatePipe,
    FormsComponent,
    InputTextareaModule,
    MultiSelectModule,
    NgIf,
    OverlayPanelModule,
    PaginatorModule,
    PrimeTemplate,
    TableModule,
    TagModule,
    RouterLink
  ],
  templateUrl: './list-table.component.html',
  styleUrl: './list-table.component.css'
})
export class ListTableComponent implements OnInit {
  @Input() service!: any;
  @Input() columns: any[] = [];
  @Input() type: string = '';
  data: any[] = [];
  rowsPerPage: number = 20;
  page: number = 0;
  loading: boolean = true;

  isModalVisible: boolean = false;
  deletedItem?: any;

  sortOrder = 1;
  sortField = 'id';

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.service.getFunction(this.page, this.rowsPerPage).subscribe(
      (response: any[]) => {
        if (response.length > 0) {
          this.data = [...(this.data || []), ...response];
          // this.filterProducts();
          this.loading = false;
          this.cdr.detectChanges();
        } else {
          this.loading = false;
          // this.isAllCard = true;
        }
      },
      (error: any) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
  }

  viewItem(item: string): string {
    return `${environment.mainUrl}/${this.type}/${item}`;
  }

  deleteButton(item: string): void {
    this.service.deleteItem(item).subscribe((result: any) => {
      this.closeModal();
      this.data = this.data.filter( el => el.id !== item );
    })
  }

  closeModal() {
    this.deletedItem = null;
    this.isModalVisible = false;
  }

  openDeletePopup(item: any): void {
    this.deletedItem = item;
    this.isModalVisible = true;
    console.log('this.isModalVisible = false;');
  }

}
