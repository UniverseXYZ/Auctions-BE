import { IsBoolean, IsNumber } from "class-validator";

export class Nft {
  @IsNumber()
  nftId: number;

  @IsBoolean()
  claimed: boolean;
}
