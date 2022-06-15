import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Nfts {
  @Prop({ required: true })
  public contractAddress: string;

  @Prop({ required: true })
  public tokenId: number;
}

export type NftsDocument = Nfts & Document;

export const NftsSchema = SchemaFactory.createForClass(Nfts);
