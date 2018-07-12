import { Component, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

export enum mode {
  edit,
  create
}


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  private mode: mode;
  private postId: string;
  post: Post;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = mode.edit;
          this.postId = paramMap.get('postId');
          this.postsService.getPost(this.postId).subscribe(
            postData =>  {
              this.post = {id: postData._id, title: postData.title, content: postData.content };
            }
          );
        } else {
          this.mode = mode.create;
          this.postId = null;
        }
      }
    );
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === mode.create) {
      this.postsService.addPost(form.value.title, form.value.content);
      form.resetForm();
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content)
    }
  }
}
