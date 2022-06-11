import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RoyaltySplits, RoyaltySplitsSchema } from "./royaltySplits.schema";

@Schema({ timestamps: true, collection: "auctions" })
export class Auctions {
  @Prop({ trim: true, required: true })
  public owner: string;

  @Prop({ trim: true, required: true })
  public name: string;

  @Prop({ trim: true, required: true })
  public tokenAddress: string;

  @Prop({ trim: true, required: true })
  public tokenSymbol: string;

  @Prop({ required: true })
  public tokenDecimals: number;

  @Prop({ required: true })
  public startDate: Date;

  @Prop({ required: true })
  public endDate: Date;

  @Prop({ type: [RoyaltySplitsSchema], required: true })
  public royaltySplits: [RoyaltySplits];
}

export type AuctionsDocument = Auctions & Document;

export const AuctionsSchema = SchemaFactory.createForClass(Auctions);
AuctionsSchema.index({ owner: 1, _id: 1 }, { unique: true });
