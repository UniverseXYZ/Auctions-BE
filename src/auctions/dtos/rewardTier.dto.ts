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
    example: 2,
  })
  @IsNumber()
  numberOfWinners: number;

  @ApiProperty({
    description: "The nft slot configuration",
    example: [
      {
        nfts: [
          {
            contractAddress: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
            tokenId: "1",
          },
          {
            contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
            tokenId: "2",
          },
        ],
        minimumBid: "0.1",
      },
      {
        nfts: [
          {
            contractAddress: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
            tokenId: "3",
          },
          {
            contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
            tokenId: "4",
          },
        ],
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
