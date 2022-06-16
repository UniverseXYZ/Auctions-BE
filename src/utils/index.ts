//TODO: separate errors, functions etc

import mongoose from "mongoose";
import { Nft } from "src/auctions/dtos/nft.dto";
import { NftSlots } from "src/auctions/dtos/nftSlots.dto";
import { TierDto } from "src/auctions/dtos/rewardTier.dto";

export const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const castToId = (id: string) => new mongoose.Types.ObjectId(id);

export const getNftsEndpoint = (ownerAddress: string, page: string) => {
  return `${process.env.CLOUND_FUNCTION_URI}?action=query&ownerAddress=${ownerAddress}&page=${page}`;
};

export const getNftsAvailability = (rewardTiers, userNfts) => {
  if (!rewardTiers.length) {
    return [];
  }
  const nftsInTiers = rewardTiers
    .map((tier: TierDto) => tier.nftSlots)
    .flat()
    .map((slot: NftSlots) => slot.nfts)
    .flat();

  const updatedNfts = userNfts.nfts.map((userNft: Partial<Nft>) => {
    const { contractAddress, tokenId } = userNft;

    const used = nftsInTiers.find(
      (nftInTier: Nft) =>
        contractAddress === nftInTier.contractAddress &&
        tokenId.toString() === nftInTier.tokenId.toString()
    );

    if (used) {
      return {
        ...userNft,
        used: true,
      };
    }
    return userNft;
  });

  userNfts.nfts = updatedNfts;

  return userNfts;
};
