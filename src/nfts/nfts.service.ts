import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { TierDto } from "src/auctions/dtos/rewardTier.dto";
import { NftSlots } from "src/auctions/dtos/nftSlots.dto";
import { Nft } from "src/auctions/dtos/nft.dto";

@Injectable()
export class NftsService {
  constructor(private httpService: HttpService) {}

  async getNfts(ownerAddress: string, page: string): Promise<any> {
    return await firstValueFrom(
      this.httpService.get(
        `${process.env.CLOUND_FUNCTION_URI}?action=query&ownerAddress=${ownerAddress}&page=${page}`
      )
    );
  }

  getNftsAvailability(rewardTiers: TierDto[], userNfts) {
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
  }
}
