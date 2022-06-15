import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Nft } from "./nft.dto";

export class NftSlots {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Nft)
  @ApiProperty({ type: () => Nft, isArray: true })
  nfts: Nft[];

  @IsNumber()
  @IsOptional()
  minimumBid: number;
}
