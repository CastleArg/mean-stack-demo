import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Array<Post> = [];
  private postsUpdated = new Subject<Post[]>();
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any[]}>(`${this.baseURL}/posts`)
    .pipe(map((data) => {
      return data.posts.map(p => {
        return {
          title: p.title,
          content: p.content,
          id: p._id
        };
      });
    }))
    .subscribe(
      data => {
        this.posts = data;
        this.postsUpdated.next([...this.posts]);
      }
    );
  }

getPostUpdateListener() {
  return this.postsUpdated.asObservable();
}

  addPost(post: Post) {
    this.http.post<{createdPostId: string}>(`${this.baseURL}/posts`, post)
    .subscribe(
      (data) => {
        post.id = data.createdPostId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      },
      err => console.log(err)
    );
  }

  deletePost(postId: string) {
    this.http.delete(`${this.baseURL}/posts/${postId}`)
    .subscribe(
      () => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdated.next([...this.posts]);
      },
      e => console.log(e)
    );
  }
}
