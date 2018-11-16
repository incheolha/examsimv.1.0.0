import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Toefl } from '../models/toefl.model';
import { Reading } from '../models/reading.model';
import { ImageSettingTime } from '../models/image.model';

import { Http, Response } from '@angular/http';
import { UtilityService } from '../../Utility-shared/utility.service';
import { ProfileInfo } from '../../auth/profile.model';

@Injectable()
export class RegisterToeflService {

  registerToeflExamChanged = new Subject<Toefl[]>();

  profileInfo: ProfileInfo;
  lastToeflNo = 0;
  private date = new Date();
  private toefls: Toefl[] = [];


  constructor(private http: Http,
              private utilityService: UtilityService) {}

  getRegisterToefls() {

    // 서버로 부터 모든 데이타를 가져오기 위해서는 반드시 현재 login한 userId와 token이 필요하다
    this.toefls = [];
    const token = localStorage.getItem('token');

    this.http.get('http://localhost:3000/registerExam/' + '?token=' + token)
                  .subscribe(
                    (res: Response) => {
                          console.log(res);
                          const data = res.json();
                          console.log(data);
                          this.toefls = [];
                          for (const toeflItem of data.toefls) {
                                this.toefls.push(toeflItem);
                                                                         // 서버로 부터 가저오는 데이타가 array형태로 unwrapping되므로
                          }
                         this.registerToeflExamChanged.next(this.toefls.slice());
                                                                              // for looping으로 개별적이 toeflItem을 push로 저장해주어야 한다
                  },
                  (error) => console.log(error)                              // 나중에 이 error는 alert로 처리한다
                );
      console.log(this.toefls);
      return this.toefls.slice();
    }


  getRegisterToefl(toeflNo: number) {
    this.registerToeflExamChanged.next(this.toefls.slice());

    for (let i = 0; i <= this.toefls.length; i++) {
      if (this.toefls[i].toeflNo === toeflNo) {
         return this.toefls[i];
      }
    }
  }


  getLastToeflNo() {
    return this.lastToeflNo = this.toefls.slice()[this.toefls.length - 1].toeflNo + 1;
  }
  // getToeflLastNo() {

  //   return this.http.get('http://localhost:3000/showexam')
  //           .map ( (res: Response) => {
  //             const data = res.json();
  //             this.lastToeflNo = data.lastToeflNo + 1;
  //             return this.lastToeflNo;
  //           });
  // }


  // toefllist 추가 기능
  addRegisterToeflExam(toeflNo: number, formData: FormData) {

    // 일단 onSubmit을 진행된 formData를 받아서 곧바로 toekn과 함께 posting을 server에 요청한다
    // 그런후 서버로 부터오는 결과가 error가 없으면 그결과를 res,json() object로 unwrapping 한다
    // 이제 front 쪽 toefls array에 결과물인 data.toefl을 push한후 slice를 통해 최신 toelflist를 생성한다
    // Audio Play Service 중 toefl List에서 소리가 나면 값은 "1" === 소리 실행
    // 만일 add, detail, edit component는 "2" --- 소리를 중지
    // add 와 edit 후  save 버튼을 누르면 새로 update된 값으로 소리 실행  === "3"


    const token = localStorage.getItem('token');

    this.http.post('http://localhost:3000/registerExam/' + toeflNo + '?token=' + token, formData)
                    .subscribe(
                      (res: Response) => {
                            console.log(res);
                            const data = res.json();
                            console.log('추가된 토플', data.toefl);
                            console.log('현재 토플명단에 추가되기전 명단', this.toefls);
                            this.toefls.push(data.toefl);
                            console.log('현재 토플명단에 추가된 후 명단', this.toefls);
                            this.registerToeflExamChanged.next([...this.toefls]);
                          //  this.utilityService.audioPlaySevice(data.toefl.toeflAudio, '3', false);

                    },
                    (error) => console.log(error)              // 나중에 이 error는 alert로 처리한다
                  );
  }

  // toefl item edit후 서버연결후 최신 toefllist로 만드는 method

  updateRegisterToeflExam(toeflNo: number, formData: FormData) {

    // add와 마찬가지로 onSubmit으로 부터 받은 데이타를 formData로 받아서 token과 같이 patch한다.
    // 그결과물을 받아 res.json()으로 upwrapping한후 toefllist에 index 값으로 update한다
    // Audio Play Service 중 toefl List에서 소리가 나면 값은 "1" === 소리 실행
    // 만일 add, detail, edit component는 "2" --- 소리를 중지
    // add 와 edit 후  save 버튼을 누르면 새로 update된 값으로 소리 실행  === "3"


    const token = localStorage.getItem('token');

    this.http.patch('http://localhost:3000/registerExam/' + toeflNo + '?token=' + token, formData)
                    .subscribe((res: Response) => {
                      const data = res.json();
                      console.log(data.toefl);
                      for (let i = 0; i < this.toefls.length; i++) {
                        if (this.toefls[i].toeflNo === data.toefl.toeflNo) {
                          this.toefls[i] = data.toefl;
                        }
                      }
                      this.registerToeflExamChanged.next(this.toefls.slice());
                     // this.utilityService.audioPlaySevice(data.toefl.toeflAudio, '3', false);
                    },
                  (error) => console.log(error)
                  );
  }

  // toefl list 삭제 기능

  deleteRegisterToeflExam(toeflNo: number) {

    // Registration Toefl을 제거할때는 반드시 toeflNo가 필요하다
    // 하지만 front toeflList에서는 index number가 필요하므로 항상 1을 빼고 추가하는작없을 잊어버리면 안된다

    const token = localStorage.getItem('token');

    this.http.delete('http://localhost:3000/registerExam/' + toeflNo + '?token=' + token)
                    .subscribe((res: Response) => {
                      const data = res.json();

                      for (let i = 0; i < this.toefls.length; i++) {
                        if (this.toefls[i].toeflNo === toeflNo) {
                          this.toefls.splice(i, 1);
                        }
                      }
                      this.registerToeflExamChanged.next(this.toefls.slice());
                    },
                  (error) => console.log(error)
                  );

  }


}
