import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from "class-validator";
import { ETHEREUM_ADDRESS } from "../../utils/constants";
import { RoyaltySplitDto } from "./royaltySplits.dto";

export class AuctionDto {
  @ApiProperty({
    description: "The owner of the auction",
    example: "0x13BBDC67f17A0C257eF67328C658950573A16aDe",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(ETHEREUM_ADDRESS.VALID, {
    message: ETHEREUM_ADDRESS.INVALID_MESSAGE,
  })
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
    example: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(ETHEREUM_ADDRESS.VALID, {
    message: ETHEREUM_ADDRESS.INVALID_MESSAGE,
  })
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
  @ValidateNested({ each: true })
  @Type(() => RoyaltySplitDto)
  @ApiProperty({ type: () => RoyaltySplitDto, isArray: true })
  royaltySplits: RoyaltySplitDto[];
}
