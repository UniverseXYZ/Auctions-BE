import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import { ETHEREUM_ADDRESS } from "../../utils/constants";

export class Nft {
  @IsString()
  @IsNotEmpty()
  @Matches(ETHEREUM_ADDRESS.VALID, {
    message: ETHEREUM_ADDRESS.INVALID_MESSAGE,
  })
  contractAddress: string;
  @IsString()
  tokenId: string;
}
