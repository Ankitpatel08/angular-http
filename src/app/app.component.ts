import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {Post} from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: any = [];
  isLoading = false;
  error = null;
  errorSubscription: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.errorSubscription = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.postService.clearPosts().subscribe(()=> {
      this.loadedPosts = [];
    });
  }

  private fetchPosts() {
    this.isLoading = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isLoading = false;
      this.loadedPosts = posts;
    }, error => {
      this.isLoading = false;
      this.error = error.error.error;
      console.log(error);
    });
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  onHandleError() {
    this.error = false;
  }
}
