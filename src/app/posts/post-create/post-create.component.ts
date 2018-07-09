import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';
  @Output() postCreated = new EventEmitter();

  onAddPost(postInput: string) {
    const post = {
      content: this.enteredContent,
      title: this.enteredTitle
    };
    this.postCreated.emit(post);
  }
}
