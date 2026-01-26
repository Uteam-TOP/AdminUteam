import {Component, inject} from '@angular/core';
import {ListCardsComponent} from "../list-cards/list-cards.component";
import {ProjectsService} from "../services/projects.service";
import {ListTableComponent} from "../../../shared/list-table/list-table.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ListCardsComponent,
    ListTableComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {

  public projectService = inject(ProjectsService);

  columns: any[] = [
    {name: 'ID', type: 'id'},
    {name: 'Название', type: 'title'},
    {name: 'Тип', type: 'type'},
    {name: 'Автор', type: 'owner.nickname'},
    {name: 'Описание', type: 'summary'},
    {name: 'Дата создания', type: 'createdAt'},
  ];
}
