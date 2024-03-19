import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private versionUrl = 'assets/version.json'; // Path to your version JSON file

  constructor(private http: HttpClient) { }

  getVersion(): Observable<string> {
    return this.http.get<any>(this.versionUrl).pipe(
      map(data => data.version),
      
      catchError(error => {
        console.error('Error fetching version:', error);
        return of('Version not available');
      })
    );
  }
}