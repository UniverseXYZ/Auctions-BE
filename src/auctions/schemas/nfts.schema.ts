import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, Matches } from "class-validator";
import { Document } from "mongoose";
import { ETHEREUM_ADDRESS } from "../../utils";

@Schema()
export class Nfts {
  @IsNotEmpty()
  @Matches(ETHEREUM_ADDRESS.VALID, {
    message: ETHEREUM_ADDRESS.INVALID_MESSAGE,
  })
  public contractAddress: string;

  @Prop({ required: true })
  public nftId: number;

  @Prop({ required: true })
  public claimed: boolean;
}

export type NftsDocument = Nfts & Document;

export const NftsSchema = SchemaFactory.createForClass(Nfts);
