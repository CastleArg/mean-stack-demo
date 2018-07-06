import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost = 'Please Add your post';
  enteredValue = '';
  constructor() {}

  ngOnInit() {}

  onAddPost(postInput: string) {
    this.newPost = this.enteredValue; // .value;
  }
}
