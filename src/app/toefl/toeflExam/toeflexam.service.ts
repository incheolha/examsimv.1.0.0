import { Toefl } from './../models/toefl.model';
import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AuthService} from '../../auth/auth.service';

import { Subject } from 'rxjs/Subject';
import { Http, Response } from '@angular/http';

@Injectable()
export class ToeflExamService {

  loginStatusChecked = false;

  private toefls: Toefl[] = [];
  public toeflListChanged = new Subject<Toefl[]>();
  constructor(private http: Http)  {}

  getAllToeflLists() {

    this.http.get('http://localhost:3000/showExam/')
                  .subscribe(
                    (res: Response) => {
                          console.log(res);
                          const data = res.json();
                          console.log(data);
                          this.toefls.splice(0);
                          for (const toeflItem of data.toefls) {
                                this.toefls.push(toeflItem);
                          }
                    console.log(this.toefls.slice());
                    this.toeflListChanged.next(this.toefls.slice());
                  },
                  (error) => console.log(error)
                );
     return this.toefls.slice();
  }
}


