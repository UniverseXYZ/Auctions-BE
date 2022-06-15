import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { isEmpty } from "lodash";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { isValidId } from "../../utils";
import { Exceptions } from "../exceptions";

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // * Run before the request reaches the request handler
    const http = context.switchToHttp();
    const request = http.getRequest();

    const auctionId = request.params.id;
    const urlTierId = request.params.rewardTierId;
    const queryTierId = request.query.tierId;

    if (!isValidId(auctionId)) {
      Exceptions.auctionNotFound(auctionId);
    }

    if (!isEmpty(urlTierId) && !isValidId(urlTierId)) {
      Exceptions.tierNotFound(urlTierId);
    }

    if (!isEmpty(queryTierId) && !isValidId(queryTierId)) {
      Exceptions.tierNotFound(queryTierId);
    }

    // * Run before sending a response to the client
    return next.handle().pipe(
      map((response: any) => {
        if (!response) {
          Exceptions.resourceNotFound();
        }

        return response;
      })
    );
  }
}
