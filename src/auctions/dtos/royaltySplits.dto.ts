import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min } from "class-validator";

export class RoyaltySplitDto {
  @ApiProperty({
    description: "Ethereum address",
    example: "0x0000000000000000000000000000",
  })
  @IsString()
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
