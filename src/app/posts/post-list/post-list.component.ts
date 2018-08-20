import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts = new Array<Post>();
  postUpdateListenerSub: Subscription;
  isLoading = false;
  isLoggedIn = false;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postUpdateListenerSub = this.postsService.getPostUpdateListener().subscribe(
      (posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      }
    );
    this.isLoggedIn = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe(
      isAuth => this.isLoggedIn = isAuth
    );
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postUpdateListenerSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
