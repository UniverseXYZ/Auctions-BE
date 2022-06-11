import { HttpException, HttpStatus } from "@nestjs/common";

export class Exceptions {
  static auctionNotFound(id: string) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `Auction with id '${id}' does not exist`,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
