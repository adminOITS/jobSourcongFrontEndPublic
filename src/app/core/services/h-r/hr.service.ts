import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { H_R_Request, H_R_Response } from '../../models/hr.models';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class HRService {
  private readonly baseUrl = environment.domain + '/hr';
  private http = inject(HttpClient);

  getAll(
    page: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<H_R_Response>> {
    return this.http
      .get<PaginatedResponse<H_R_Response>>(
        `${this.baseUrl}?page=${page}&pageSize=${pageSize}`
      )
      .pipe(take(1));
  }

  getById(id: string): Observable<H_R_Response> {
    return this.http.get<H_R_Response>(`${this.baseUrl}/${id}`).pipe(take(1));
  }

  create(hr: H_R_Request, companyId: string): Observable<H_R_Response> {
    return this.http.post<H_R_Response>(this.baseUrl, hr).pipe(take(1));
  }

  update(id: string, hr: H_R_Request): Observable<H_R_Response> {
    return this.http
      .put<H_R_Response>(`${this.baseUrl}/${id}`, hr)
      .pipe(take(1));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(take(1));
  }
}
