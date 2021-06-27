import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // control request before it leaves app
        const modifiedRequest = req.clone({
            headers: req.headers.append('Auth', 'abc')
        })

        return next.handle(modifiedRequest);
    }
}