import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";
import { NftSlots } from "./nftSlots.dto";

export class TierDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNumber()
  numberOfWinners: number;

  @IsString()
  nftsPerWinner: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => NftSlots)
  @ApiProperty({ type: () => NftSlots, isArray: true })
  nftSlots: NftSlots[];
}
