import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { AuctionDto } from "./dtos/auction.dto";
import { AuctionsService } from "./auctions.service";
import { TierDto } from "./dtos/rewardTier.dto";
import { AuctionsExceptionInterceptor } from "./interceptors/auctions.interceptor";
import { RewardTiersExceptionInterceptor } from "./interceptors/rewardTiers.interceptor";
import { NftsService } from "../nfts/nfts.service";
import { Tokens } from "../utils/tokens";
import { Exceptions } from "./exceptions";

//! TODO: add auth
@Controller("auctions")
export class AuctionsController {
  constructor(
    private readonly auctionService: AuctionsService,
    private readonly nftsService: NftsService,
    private readonly tokens: Tokens
  ) {}

  @Post()
  @ApiOperation({ summary: "Create new auction" })
  async createAuction(@Body() auction: AuctionDto) {
    const { tokenSymbol } = auction;
    const allowedTokens = this.tokens.getTokens();

    if (!allowedTokens[tokenSymbol]) {
      Exceptions.tokenNotAllowed(tokenSymbol);
    }

    auction.tokenDecimals = allowedTokens[tokenSymbol].decimals;
    return await this.auctionService.createAuction(auction);
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @UseInterceptors(RewardTiersExceptionInterceptor)
  @Patch("/:auctionId/tier/")
  @ApiOperation({ summary: "Create or edit reward tier" })
  async createRewardTier(
    @Body() tier: TierDto,
    @Param("auctionId") auctionId,
    @Query("tierId") tierId
  ) {
    const auction = await this.auctionService.getAuction(auctionId);
    if (!auction) {
      Exceptions.auctionNotFound(auctionId);
    }

    if (!tierId) {
      return await this.auctionService.createRewardTier(
        tier,
        auctionId,
        auction
      );
    }

    const result = await this.auctionService.editRewardTier(
      tier,
      auctionId,
      tierId,
      auction
    );

    if (!result) {
      // throw generic exeption
      Exceptions.resourceNotFound();
    }
    return result;
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Delete("/:auctionId")
  @ApiOperation({ summary: "Remove draft auction" })
  @ApiParam({
    name: "Auction id",
    type: String,
    required: true,
  })
  async removeAuction(@Param("auctionId") auctionId) {
    const result = await this.auctionService.removeAuction(auctionId);

    if (!result) {
      Exceptions.auctionNotFound(auctionId);
    }

    return result;
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Get("/:auctionId")
  @ApiOperation({ summary: "Get auction" })
  async getAuction(@Param("auctionId") auctionId) {
    //TODO: get NFTs name etc
    const auction = await this.auctionService.getAuction(auctionId);
    if (!auction) {
      Exceptions.auctionNotFound(auctionId);
    }
    return auction;
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @UseInterceptors(RewardTiersExceptionInterceptor)
  @Delete("/:auctionId/tier/:rewardTierId")
  @ApiOperation({ summary: "Remove reward tier" })
  async removeRewardTier(
    @Param("auctionId") auctionId,
    @Param("rewardTierId") rewardTierId
  ) {
    const auction = await this.auctionService.getAuction(auctionId);
    if (!auction) {
      Exceptions.auctionNotFound(auctionId);
    }

    return await this.auctionService.removeRewardTier(
      auctionId,
      rewardTierId,
      auction
    );
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Get("/:auctionId/availability")
  @ApiOperation({ summary: "Get available NFTs" })
  async getAvailableNfts(
    @Req() req,
    @Param("auctionId") auctionId,
    @Query("tierId") tierId,
    @Query("page") page
  ) {
    //get reward tiers count
    const rewardTiersLength = await this.auctionService.getRewardTiersLength(
      auctionId
    );

    //get all user nfts
    const userNfts = await this.nftsService.getNfts(
      "0x13BBDC67f17A0C257eF67328C658950573A16aDe",
      page || "1"
    ); // ! TODO: remove the hardcoded owner address at some point

    if (!tierId) {
      if (!rewardTiersLength) {
        return userNfts.data;
      } else {
        const rewardTiersResult = await this.auctionService.getAllRewardTiers(
          auctionId
        );

        const nftsWithFlag = this.nftsService.getNftsAvailability(
          rewardTiersResult.rewardTiers,
          userNfts.data
        );

        return nftsWithFlag;
      }
    }

    const rewardTiersResult = await this.auctionService.getRewardTiers(
      auctionId,
      tierId
    );

    const nftsWithFlag = this.nftsService.getNftsAvailability(
      rewardTiersResult.rewardTiers || [],
      userNfts.data
    );

    return nftsWithFlag;
  }
}
