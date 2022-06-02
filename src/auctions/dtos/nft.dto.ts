import { IsBoolean, IsNumber } from "class-validator";

export class Nft {
  @IsNumber()
  nftId: number;

  @IsBoolean()
  deposited: boolean;

  @IsBoolean()
  claimed: boolean;
}
