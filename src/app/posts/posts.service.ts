import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Array<Post> = [];
  private postsUpdated = new Subject<Post[]>();
  private baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>(`${this.baseURL}/posts`).subscribe(
      data => {
        this.posts = data.posts;
        this.postsUpdated.next([...this.posts]);
      }
    );
  }

getPostUpdateListener() {
  return this.postsUpdated.asObservable();
}

  addPost(post: Post) {
    this.http.post(`${this.baseURL}/posts`, post)
    .subscribe(
      (data) => {
        console.log(data);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      },
      err => console.log(err)
    );
  }
}
