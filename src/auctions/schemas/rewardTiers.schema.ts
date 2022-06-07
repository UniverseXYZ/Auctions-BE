import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { NftSlots, NftSlotsSchema } from "./nftSlots.schema";

@Schema()
export class RewardTiers {
  @Prop({ trim: true, required: true })
  public name: string;

  @Prop({ required: true })
  public numberOfWinners: number;

  @Prop({ trim: true, required: true })
  public nftsPerWinner: string;

  @Prop({ type: [NftSlotsSchema], required: true })
  public nftSlots: [NftSlots];
}

export type RewardTiersDocument = RewardTiers & Document;

export const RewardTiersSchema = SchemaFactory.createForClass(RewardTiers);
