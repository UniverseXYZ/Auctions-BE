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
    example: "0x0000000000000000000000000000",
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
