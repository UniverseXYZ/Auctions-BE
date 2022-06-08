import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true, collection: "nft-unavailable" })
export class NftUnavailable {
  @Prop({ trim: true, required: true })
  public contract: string;

  @Prop({ trim: true, required: true })
  public tokenId: number;
}

export type NftUnavailableDocument = NftUnavailable & Document;

export const NftUnavailableSchema =
  SchemaFactory.createForClass(NftUnavailable);
NftUnavailableSchema.index({ contract: 1 });
