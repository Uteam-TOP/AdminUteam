import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environment";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private http = inject(HttpClient);
  constructor() { }

  getFunction(page: number = 0): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/main/project/get-by-filter?page=${page}&size=10`, {});
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/projects/${id}`);
  }
}
