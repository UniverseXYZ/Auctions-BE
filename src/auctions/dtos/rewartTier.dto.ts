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
  @ApiProperty({
    description: "The name of reward tier",
    example: "Reward tier 1",
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: "Number of winners for the tier",
    example: 3,
  })
  @IsNumber()
  numberOfWinners: number;

  @ApiProperty({
    description: "The range of allocated nfts per winner",
    example: "1-3",
  })
  @IsString()
  nftsPerWinner: string;

  @ApiProperty({
    description: "The nft slot configuration",
    example: [
      {
        nfts: [
          {
            nftId: 1,
            claimed: false,
          },
          {
            nftId: 4,
            claimed: false,
          },
        ],
        minimumBid: 0.1,
        capturedRevenue: false,
      },
      {
        nfts: [
          {
            nftId: 2,
            claimed: false,
          },
        ],
        minimumBid: 0.1,
        capturedRevenue: false,
      },
      {
        nfts: [
          {
            nftId: 3,
            claimed: false,
          },
        ],
        minimumBid: 0.1,
        capturedRevenue: false,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => NftSlots)
  @ApiProperty({ type: () => NftSlots, isArray: true })
  nftSlots: NftSlots[];
}
