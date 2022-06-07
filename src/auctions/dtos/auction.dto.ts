import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";
import { TierDto } from "./rewartTier.dto";
import { RoyaltySplitDto } from "./royaltySplits.dto";

export class AuctionDto {
  @ApiProperty({
    description: "The owner of the auction",
    example: "0x13BBDC67f17A0C257eF67328C658950573A16aDe",
  })
  @IsString()
  owner: string;

  @ApiProperty({
    description: "The name of the auction",
    example: "Auction1",
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: "Address of the bidding token",
    example: "0x0000000000000000000000000000000",
  })
  @IsString()
  tokenAddress: string;

  @ApiProperty({
    description: "Symbol of the bidding token",
    example: "XYZ",
  })
  @IsString()
  tokenSymbol: string;

  @ApiProperty({
    description: "Number of decimals of the bidding token",
    example: 18,
  })
  @IsNumber()
  tokenDecimals: number;

  @ApiProperty({
    description: "Start date of the auction in ISO format",
    example: "2021-07-20T09:02:31.168Z",
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: "End date of the auction in ISO format",
    example: "2021-07-20T09:02:31.168Z",
  })
  @IsDateString()
  endDate: Date;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RoyaltySplitDto)
  @ApiProperty({ type: () => RoyaltySplitDto, isArray: true })
  royaltySplits: RoyaltySplitDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TierDto)
  @ApiProperty({ type: () => TierDto, isArray: true })
  rewardTiers: TierDto[];
}
