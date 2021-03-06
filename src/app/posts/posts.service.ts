import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Array<Post> = [];
  private postsUpdated = new Subject<Post[]>();
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

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

  getPost(id: string): Observable<{_id: string, title: string, content: string}> {
    return this.http.get<{_id: string, title: string, content: string}>(`${this.baseURL}/posts/${id}`);
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{createdPostId: string}>(`${this.baseURL}/posts`, post)
    .subscribe(
      (data) => {
        post.id = data.createdPostId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      },
      err => console.log(err)
    );
  }

  updatePost(postId: string, title: string, content: string) {
    const post: Post = {id: postId, title: title, content: content};
    this.http.put(`${this.baseURL}/posts/${postId}`, post)
    .subscribe(
      () => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);  // Don't think routing should be coupled to this method.
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
