import { HttpException, HttpStatus } from "@nestjs/common";
import { IMAGE_ERRORS } from "src/utils/constants";

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

  static resourceNotFound() {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `The resource does not exist`,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  static tierNotFound(id: string) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `Reward tier with id '${id}' does not exist`,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  static tokenNotAllowed(token: string) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `Token '${token}' is not allowed`,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  static invalidFileType(mimeTypes: string[]) {
    // ! returning this only for typescript reasons
    return new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `File type is not valid. Supported types are: ${mimeTypes}`,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  static uploadAuctionImagesFailed() {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: IMAGE_ERRORS.UPLOAD_AUCTION_IMAGE,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  static uploadRewardTierImageFailed() {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: IMAGE_ERRORS.UPLOAD_TIER_IMAGE,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
