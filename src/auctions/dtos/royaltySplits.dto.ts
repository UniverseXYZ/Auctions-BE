import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
} from "class-validator";
import { ETHEREUM_ADDRESS } from "src/utils";

export class RoyaltySplitDto {
  @ApiProperty({
    description: "Ethereum address",
    example: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(ETHEREUM_ADDRESS.VALID, {
    message: ETHEREUM_ADDRESS.INVALID_MESSAGE,
  })
  address: string;

  @ApiProperty({
    description: "Percentage of split royalty",
    example: 10,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentAmount: number;
}
