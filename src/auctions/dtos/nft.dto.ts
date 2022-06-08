import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from "class-validator";
import { ETHEREUM_ADDRESS } from "src/utils";

export class Nft {
  @IsString()
  @IsNotEmpty()
  @Matches(ETHEREUM_ADDRESS.VALID, {
    message: ETHEREUM_ADDRESS.INVALID_MESSAGE,
  })
  contractAddress: string;

  @IsNumber()
  nftId: number;

  @IsBoolean()
  claimed: boolean;
}
