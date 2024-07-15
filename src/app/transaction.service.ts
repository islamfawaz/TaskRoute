import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class TransactionService {
  private apiUrl = 'https://api.jsonbin.io/v3/b/66919124ad19ca34f886b441';
  private headers = new HttpHeaders({
    'X-MASTER-KEY': '$2a$10$K.10CRqSAm99ZwWGiMxDHORRFKhfdP0A/Wwo3WcJFTLAWUGBXD7w.',
    'X-ACCESS-KEY': '$2a$10$ODGT4Aev.XdWiqZ3VZyO/efENlb667TciGBh4B7rLJv/XLjlWOycS'
  });

  constructor(private _HttpClient: HttpClient) { }

  getTransactions(): Observable<any> {
    return this._HttpClient.get<any>(this.apiUrl, { headers: this.headers });
  }
}
