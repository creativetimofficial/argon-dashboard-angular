import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
declare const google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  answersList: Array<Answer>;
  input: Array<string>;

  constructor(private http: HttpClient) {
    this.input = [];
    this.answersList = new Array<Answer>();
  }
  onClick(string) {
    let foo = false;
    for (let i = 0; i < this.input.length; i++) {
      if (string === this.input[i] || string.charAt(0) === this.input[i].charAt(0)) {
        foo = true;
        this.input.splice(i, 1);
        i--;
      }
    }
    if (foo === false) {
      this.answersList.push({idQuestion: parseInt(string.charAt(0), 10), idAnswer: parseInt(string.charAt(1), 10)});
    }
  }

  submit() {
    console.log(this.answersList);
    this.http.post<any>('http://localhost:8080/api/rest/answer/quizz', { title: 'answers list' }).subscribe(data => {
      this.answersList = data.id;
    });
  }

  ngOnInit() {

  }

}

class Answer {
  idQuestion: number;
  idAnswer: number;
}
