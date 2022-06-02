import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Nfts {
  @Prop({ required: true })
  public nftId: number;

  @Prop({ required: true })
  public deposited: boolean;

  @Prop({ required: true })
  public claimed: boolean;
}

export type NftsDocument = Nfts & Document;

export const NftsSchema = SchemaFactory.createForClass(Nfts);
