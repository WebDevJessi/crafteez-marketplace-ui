import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../env.development";

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  private url = environment.apiUrl;


  checkConnection(): Observable<{ message: string}> {
    return this.http.get<{ message: string }>(`${this.url}/api/data`);
  }
}
