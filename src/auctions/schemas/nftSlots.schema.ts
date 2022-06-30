import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Nfts, NftsSchema } from "./nfts.schema";

@Schema()
export class NftSlots {
  @Prop({ type: [NftsSchema], required: true })
  public nfts: Nfts[];

  @Prop()
  public minimumBid: number;
}

export type NftSlotsDocument = NftSlots & Document;

export const NftSlotsSchema = SchemaFactory.createForClass(NftSlots);
