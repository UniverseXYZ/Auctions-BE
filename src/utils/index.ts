//TODO: separate errors, functions etc

import mongoose from "mongoose";
import { Nft } from "src/auctions/dtos/nft.dto";
import { NftSlots } from "src/auctions/dtos/nftSlots.dto";
import { TierDto } from "src/auctions/dtos/rewardTier.dto";

export const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const castToId = (id: string) => new mongoose.Types.ObjectId(id);
