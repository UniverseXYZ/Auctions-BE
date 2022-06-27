import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { isValidId } from "../../utils";
import { Exceptions } from "../../errors/exceptions";

@Injectable()
export class AuctionsExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // * Run before the request reaches the request handler
    const http = context.switchToHttp();
    const request = http.getRequest();

    const auctionId = request.params.auctionId;

    if (!isValidId(auctionId)) {
      Exceptions.auctionNotFound(auctionId);
    }

    // * Run before sending a response to the client
    return next.handle().pipe(map((response: Response) => response));
  }
}
