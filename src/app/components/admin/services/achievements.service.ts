import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environment";

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {
  private http = inject(HttpClient);

  constructor() { }

  getAchievements(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/achievement/all-achievements`)
  }

  addAchievement(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/achievement/add`, data)
  }

  addImage(image: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/achievement/add-image`, image)
  }

  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/achievement/${id}`,)
  }

  getUserAchievements(userId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/achievement/all-achievements-by-user/${userId}`)
  }

  setUserAchievement(userId: number, achievementId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('achievementId', achievementId);
    return this.http.post(`${environment.apiUrl}/achievement/assign-user-achievement`, {}, {params})
  }

  deleteUserAchievement(userId: number, achievementId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('achievementId', achievementId);
    return this.http.delete(`${environment.apiUrl}/achievement/not-assign-user-achievement`, {params})
  }
}
