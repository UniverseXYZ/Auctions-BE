import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class RoyaltySplits {
  @Prop({ trim: true, required: true })
  public address: string;

  @Prop({ required: true })
  public percentAmount: number;
}

export type RoyaltySplitsDocument = RoyaltySplits & Document;

export const RoyaltySplitsSchema = SchemaFactory.createForClass(RoyaltySplits);
