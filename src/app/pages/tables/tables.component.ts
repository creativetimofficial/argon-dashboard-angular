import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Element} from '@angular/compiler';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent implements OnInit {
  mailList: string[];
  token: string;

  constructor(private http: HttpClient) {
    this.mailList = [];
  }

  onCheck(string) {
    let foo = false;
    for (let i = 0; i < this.mailList.length; i++) {
      if (string === this.mailList[i]) {
        foo = true;
        this.mailList.splice(i, 1);
        i--;
      }
    }
    if (foo === false) {
      this.mailList.push(string);
    }


  }

  submit() {
    console.log(this.mailList);
    this.http.post<any>('http://localhost:8080/api/rest/send/mail/quizz', this.mailList).subscribe(data => {
      this.token = data;
    });
  }

  ngOnInit() {
  }

}
