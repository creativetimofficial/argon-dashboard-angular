import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  postId;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post<any>('http://localhost:8080/api/rest/answer/quizz', { title: 'Quizz Answers' }).subscribe(data => {
      this.postId = data.id;
    });
  }

}
