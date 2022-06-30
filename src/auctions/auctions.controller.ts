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
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiParam } from "@nestjs/swagger";
import { AuctionDto } from "./dtos/auction.dto";
import { AuctionsService } from "./auctions.service";
import { TierDto } from "./dtos/rewardTier.dto";
import { AuctionsExceptionInterceptor } from "./interceptors/auctions.interceptor";
import { RewardTiersExceptionInterceptor } from "./interceptors/rewardTiers.interceptor";
import { NftsService } from "../nfts/nfts.service";
import { Tokens } from "../utils/tokens";
import { Exceptions } from "../errors/exceptions";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import {
  auctionLandingImagesMulterOptions,
  rewardTierImagesMulterOptions,
} from "./file-storage/multer-options";
import { IMAGE_ERRORS, IMAGE_KEYS } from "src/utils/constants";

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

  @UseInterceptors(RewardTiersExceptionInterceptor)
  @Get("/:auctionId/availability")
  @ApiOperation({ summary: "Get available NFTs" })
  async getAvailableNfts(
    @Req() req,
    @Param("auctionId") auctionId,
    @Query("tierId") tierId,
    @Query("page") page
  ) {
    //check if the auction exists
    const auction = await this.auctionService.getAuction(auctionId);

    if (!auction) {
      Exceptions.auctionNotFound(auctionId);
    }

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

    const rewardTiersResult = await this.auctionService.getRewardTiersExcept(
      auctionId,
      tierId
    );

    const nftsWithFlag = this.nftsService.getNftsAvailability(
      rewardTiersResult.rewardTiers || [],
      userNfts.data
    );

    return nftsWithFlag;
  }

  @Get("/my-auctions/active")
  @ApiOperation({ summary: "Get my active auctions" })
  async getMyActiveAuctions(
    @Req() req,
    @Query("limit") limit,
    @Query("offset") offset
  ) {
    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";
    if (!hardcodedOwner) return [];

    const activeAuctionsCount =
      await this.auctionService.getMyActiveAuctionsCount(hardcodedOwner);

    const _limit = Number(limit) || 5;
    const _offset = Number(offset) || 0;

    const activeAuctions = await this.auctionService.getMyActiveAuctions(
      hardcodedOwner,
      _limit,
      _offset
    );
    return {
      activeAuctions: activeAuctions,
      total: activeAuctionsCount,
      offset: _offset,
    };
  }

  @Get("/my-auctions/past")
  @ApiOperation({ summary: "Get my past auctions" })
  async getMyPastAuctions(
    @Req() req,
    @Query("limit") limit,
    @Query("offset") offset
  ) {
    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";
    if (!hardcodedOwner) return [];

    const pastAuctionsCount = await this.auctionService.getMyPastAuctionsCount(
      hardcodedOwner
    );

    const _limit = Number(limit) || 5;
    const _offset = Number(offset) || 0;

    const pastAuctions = await this.auctionService.getMyPastAuctions(
      hardcodedOwner,
      _limit,
      _offset
    );
    return {
      pastAuctions: pastAuctions,
      total: pastAuctionsCount,
      offset: _offset,
    };
  }

  @Get("/my-auctions/draft")
  @ApiOperation({ summary: "Get my draft auctions" })
  async getMyDraftAuctions(
    @Req() req,
    @Query("limit") limit,
    @Query("offset") offset
  ) {
    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";
    if (!hardcodedOwner) return [];

    const draftAuctionsCount =
      await this.auctionService.getMyDraftAuctionsCount(hardcodedOwner);

    const _limit = Number(limit) || 5;
    const _offset = Number(offset) || 0;

    const draftAuctions = await this.auctionService.getMyDraftAuctions(
      hardcodedOwner,
      _limit,
      _offset
    );
    return {
      draftAuctions: draftAuctions,
      total: draftAuctionsCount,
      offset: _offset,
    };
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Patch("/:auctionId")
  @ApiOperation({ summary: "Edit auction" })
  async editAuction(
    @Param("auctionId") auctionId,
    @Body() auction: AuctionDto
  ) {
    const auctionToEdit = await this.auctionService.getAuction(auctionId);

    if (!auctionToEdit) {
      return Exceptions.auctionNotFound(auctionId);
    }

    const { tokenSymbol } = auction;
    const allowedTokens = this.tokens.getTokens();

    if (!allowedTokens[tokenSymbol]) {
      Exceptions.tokenNotAllowed(tokenSymbol);
    }

    auction.tokenDecimals = allowedTokens[tokenSymbol].decimals;
    return this.auctionService.editAuction(auctionId, auction);
  }

  @Get("/page/validate/:url")
  @ApiOperation({ summary: "Check auction url availability" })
  async checkUrlAvailability(@Param("url") url, @Req() req) {
    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";
    return await this.auctionService.checkUrlAvailability(hardcodedOwner, url);
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Patch("/:auctionId/images")
  @ApiOperation({ summary: "Upload auction images" })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: IMAGE_KEYS.promoImage }, { name: IMAGE_KEYS.backgroundImage }],
      auctionLandingImagesMulterOptions()
    )
  )
  async uploadAuctionLandingImages(
    @Req() req,
    @Param("auctionId") auctionId,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>
  ) {
    const auction = await this.auctionService.getAuction(auctionId);

    if (!auction) {
      Exceptions.auctionNotFound(auctionId);
    }

    const promoImage =
      files && files[IMAGE_KEYS.promoImage] && files[IMAGE_KEYS.promoImage][0];
    const backgroundImage =
      files &&
      files[IMAGE_KEYS.backgroundImage] &&
      files[IMAGE_KEYS.backgroundImage][0];

    return await this.auctionService.uploadAuctionImages(
      auction,
      promoImage,
      backgroundImage
    );
  }

  @Get("/name/:name")
  @ApiOperation({ summary: "Check auction name availability" })
  async checkAuctionNameAvailability(@Param("name") name, @Req() req) {
    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";
    return await this.auctionService.checkAuctionNameAvailability(
      hardcodedOwner,
      name
    );
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Get("/:auctionId/tier/:name")
  @ApiOperation({ summary: "Check reward tier name availability" })
  async checkTierNameAvailability(
    @Param("auctionId") auctionId,
    @Param("name") name,
    @Req() req
  ) {
    const auction = await this.auctionService.getAuction(auctionId);

    if (!auction) {
      Exceptions.auctionNotFound(auctionId);
    }

    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";

    return await this.auctionService.checkTierNameAvailability(
      hardcodedOwner,
      auctionId,
      name
    );
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @UseInterceptors(RewardTiersExceptionInterceptor)
  @Patch("/:auctionId/tier/:rewardTierId/image")
  @ApiOperation({ summary: "Upload reward tier image" })
  @UseInterceptors(
    FileInterceptor(IMAGE_KEYS.tierImage, rewardTierImagesMulterOptions())
  )
  //@ApiConsumes("form/multi-part")
  async uploadRewardTierImage(
    @Req() req,
    @Param("auctionId") auctionId,
    @Param("rewardTierId") rewardTierId,
    @UploadedFile() file: Express.Multer.File
  ) {
    const auction = await this.auctionService.getAuction(auctionId);

    if (!auction) {
      Exceptions.auctionNotFound(auctionId);
    }

    const rewardTier = await this.auctionService.getRewardTier(
      auctionId,
      rewardTierId
    );

    if (!rewardTier.length) {
      Exceptions.tierNotFound(rewardTierId);
    }

    return await this.auctionService.uploadRewardTierImage(
      auctionId,
      rewardTierId,
      rewardTier[0].tier,
      file
    );
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Delete("/:auctionId/images")
  @ApiOperation({ summary: "Delete image(s) from an auction" })
  async deleteAuctionImages(
    @Param("auctionId") auctionId,
    @Query("image") image,
    @Req() req
  ) {
    const auction = await this.auctionService.getAuction(auctionId);

    if (!auction) {
      Exceptions.auctionNotFound(auctionId);
    }

    if (!image) {
      return IMAGE_ERRORS.DELETE_AUCTION_IMAGE;
    }

    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";

    return await this.auctionService.deleteAuctionImages(
      hardcodedOwner,
      auction,
      image
    );
  }
}
