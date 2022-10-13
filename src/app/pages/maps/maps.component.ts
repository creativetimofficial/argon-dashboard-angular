import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
declare const google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  answers: Array<string>;

  constructor(private http: HttpClient) {
    this.answers = [];
  }
  onClick(string) {
    let foo = false;
    for (let i = 0; i < this.answers.length; i++) {
      if (string === this.answers[i] || string.charAt(0) === this.answers[i].charAt(0)) {
        foo = true;
        this.answers.splice(i, 1);
        i--;
      }
    }
    if (foo === false) {
      this.answers.push(string);
    }
  }

  submit() {
    console.log(this.answers);
    this.http.post<any>('http://localhost:8080/api/rest/answer/quizz', { title: 'answers list' }).subscribe(data => {
      this.answers = data.id;
    });
  }

  ngOnInit() {

  }

}
