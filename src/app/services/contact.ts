import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { ContactRequest } from '../models/contact';
import { Observable, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient){}

  sendMessage(data: ContactRequest) : Observable<string> {
    return this.http.post(
      this.apiUrl,
      data,
      {responseType: 'text'}
    ).pipe(
      timeout({ first: 5000 })
    );
  }
}
