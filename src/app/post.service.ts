import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, Subject, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostService {
    error = new Subject<string>();
    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = { title, content };

        this.http.post<{name: string}>('https://angular-http-02-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
            observe: 'response'
        }).subscribe(data => {
            console.log(data.body);
        }, error => {
            this.error.next(error.message);
        });
    }

    fetchPosts() : Observable<Post[]>{
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'value');

        return this.http.get<{[key: string]: Post}>('https://angular-http-02-default-rtdb.firebaseio.com/posts.json',
        {
            headers: new HttpHeaders({'custom-header': 'hello'}),
            params: searchParams
            //params: new HttpParams().set('print', 'pretty')
        }
        ).pipe(map((data) => {
            const postsArray: Post[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    postsArray.push({...data[key], id: key});
                }
            }
            return postsArray;
        }),
        catchError(errorRes => {
            //Generic Error handling tasks
            return throwError(errorRes);
        }));
    }

    clearPosts() {
        return this.http.delete('https://angular-http-02-default-rtdb.firebaseio.com/posts.json',
        {
            observe: 'events',
            responseType: 'text'
        }).pipe(tap(event => {
            if (event.type === HttpEventType.Sent) {
                //update UI
                console.log(event);
            }

            if (event.type === HttpEventType.Response) {
                console.log(event.body);
            }
        }));
    }
}