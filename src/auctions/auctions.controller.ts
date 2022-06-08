import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuctionDto } from "./dtos/auction.dto";
import { AuctionsService } from "./auctions.service";
import { NftUnavailable } from "src/availability/schemas/nft-availability.schema";
import { AvailabilityService } from "src/availability/nft-availability.service";
import { ERRORS } from "src/utils";

@Controller("auctions")
export class AuctionsController {
  constructor(
    private auctionService: AuctionsService,
    @Inject(NftUnavailable.name)
    private readonly availabilityService: AvailabilityService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create new auction" })
  async getAuctions(@Body() auction: AuctionDto) {
    //get all NFTs
    const nfts = auction.rewardTiers
      .map((tier) => tier.nftSlots)
      .flat()
      .map((slot) => slot.nfts)
      .flat();

    //* This logic is to prevent posting used NFTs from a REST client
    //check if there are unavailable NFTs
    const unavailableNfts = await this.availabilityService.getUnavailable(nfts);

    if (unavailableNfts.length) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: ERRORS.USED_NFTS,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // if all NFTs are available create an auction
    const createAuctionId = await this.auctionService.createAuction(auction);

    // add the NFTs as unavailable
    const unavailableNftsToAdd = nfts.map((nft) => {
      return {
        contract: nft.contractAddress,
        tokenId: nft.nftId,
      };
    });

    await this.availabilityService.setUnavailable(unavailableNftsToAdd);

    return createAuctionId;
  }
}
