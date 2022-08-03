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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
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
@ApiTags("Auctions")
export class AuctionsController {
  constructor(
    private readonly auctionService: AuctionsService,
    private readonly nftsService: NftsService,
    private readonly tokens: Tokens
  ) {}

  @Post()
  @ApiOperation({
    summary: "Create new auction",
    description:
      "When this endpoint is triggered it will also add tokenDecimals field to the created auction document based on the token that the user has chosen.",
  })
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
  @ApiOperation({
    summary: "Create or edit reward tier",
    description: `There are some required conditions due to which a reward tier can be created or edited. For example the auction has to start
       somewhere in the future. There are also other fileds that are added to the reward tier subdocument by the scraper.
       For example: finalised, depositedNfts, onChain, canceled. Provide tier id if you want to edit a particular reward tier.`,
  })
  @ApiQuery({ name: "tierId", required: false })
  async createRewardTier(
    @Body() tier: TierDto,
    @Param("auctionId") auctionId: string,
    @Query("tierId") tierId: string
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
  @ApiOperation({
    summary: "Remove draft auction",
    description:
      "It is required that there aren't any deposited NFTs in the auction.",
  })
  async removeAuction(@Param("auctionId") auctionId: string) {
    const result = await this.auctionService.removeAuction(auctionId);

    if (!result) {
      Exceptions.auctionNotFound(auctionId);
    }

    return result;
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Get("/:auctionId")
  @ApiOperation({ summary: "Get auction by id" })
  async getAuction(@Param("auctionId") auctionId: string) {
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
  @ApiOperation({
    summary: "Remove reward tier",
    description:
      "It is required that the auction is not finalised, doesn't have any deposited NFTs, is not onChain and is not canceled.",
  })
  async removeRewardTier(
    @Param("auctionId") auctionId: string,
    @Param("rewardTierId") rewardTierId: string
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
  @UseInterceptors(RewardTiersExceptionInterceptor)
  @Get("/:auctionId/availability")
  @ApiOperation({
    summary: "Get available NFTs",
    description: `Returns all NFTs that a particular user owns.
   Those that are used in the same auction, but in different reward tier will be marked with a flag used: true. If the client is editing a reward tier it has to provide the tier id.`,
  })
  @ApiQuery({ name: "tierId", required: false })
  @ApiQuery({ name: "page", required: false })
  async getAvailableNfts(
    @Req() req,
    @Param("auctionId") auctionId: string,
    @Query("tierId") tierId: string,
    @Query("page") page: string
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
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "offset", required: false })
  async getMyActiveAuctions(
    @Req() req,
    @Query("limit") limit: string,
    @Query("offset") offset: string
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
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "offset", required: false })
  async getMyPastAuctions(
    @Req() req,
    @Query("limit") limit: string,
    @Query("offset") offset: string
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
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "offset", required: false })
  async getMyDraftAuctions(
    @Req() req,
    @Query("limit") limit: string,
    @Query("offset") offset: string
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
  @ApiOperation({
    summary: "Edit auction",
    description:
      "When this endpoint is triggered it will check the token symbol and add token decimals field, the same way as in the endpoint for creating an auction.",
  })
  async editAuction(
    @Param("auctionId") auctionId: string,
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
  @ApiOperation({
    summary: "Check auction url availability",
    description:
      "This endpoint will return if the page url provided in the url param is available to use or used for another auction by the same user.",
  })
  async checkUrlAvailability(@Param("url") url: string, @Req() req) {
    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";
    return await this.auctionService.checkUrlAvailability(hardcodedOwner, url);
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Patch("/:auctionId/images")
  @ApiOperation({
    summary: "Upload auction images",
    description:
      "This endpoint accepts jpeg and png formats. It is required for the client to send at least one image with the following key: promo-image or background-image.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        ["promo-image"]: {
          type: "string",
          format: "binary",
        },
        ["background-image"]: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: IMAGE_KEYS.promoImage }, { name: IMAGE_KEYS.backgroundImage }],
      auctionLandingImagesMulterOptions()
    )
  )
  async uploadAuctionLandingImages(
    @Req() req,
    @Param("auctionId") auctionId: string,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>
  ) {
    const promoImage =
      files && files[IMAGE_KEYS.promoImage] && files[IMAGE_KEYS.promoImage][0];
    const backgroundImage =
      files &&
      files[IMAGE_KEYS.backgroundImage] &&
      files[IMAGE_KEYS.backgroundImage][0];

    if (!promoImage && !backgroundImage) {
      return Exceptions.uploadAuctionImagesFailed();
    }

    const auction = await this.auctionService.getAuction(auctionId);

    if (!auction) {
      Exceptions.auctionNotFound(auctionId);
    }

    return await this.auctionService.uploadAuctionImages(
      auction,
      promoImage,
      backgroundImage
    );
  }

  @Get("/name/:name")
  @ApiOperation({
    summary: "Check auction name availability",
    description:
      "This endpoint will return if the auction name provided in the url param is available to use or used for another auction by the same user.",
  })
  async checkAuctionNameAvailability(@Param("name") name: string, @Req() req) {
    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";
    return await this.auctionService.checkAuctionNameAvailability(
      hardcodedOwner,
      name
    );
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Get("/:auctionId/tier/:name")
  @ApiOperation({
    summary: "Check reward tier name availability",
    description:
      "This endpoint will return if the reward tier name provided in the url param is available to use or used for another reward tier in the same auction.",
  })
  async checkTierNameAvailability(
    @Param("auctionId") auctionId: string,
    @Param("name") name: string,
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
  @ApiOperation({
    summary: "Upload reward tier image",
    description:
      "This endpoint accepts jpeg and png formats. It is required for the client to send one image with the following key: tier-image.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        ["tier-image"]: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor(IMAGE_KEYS.tierImage, rewardTierImagesMulterOptions())
  )
  async uploadRewardTierImage(
    @Req() req,
    @Param("auctionId") auctionId: string,
    @Param("rewardTierId") rewardTierId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      return Exceptions.uploadRewardTierImageFailed();
    }

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
  @ApiOperation({
    summary: "Delete one or more images from an auction",
    description:
      "After calling successfully this endpoint the image value will be set to null in the DB.",
  })
  async deleteAuctionImages(
    @Param("auctionId") auctionId: string,
    @Query("image") image: string,
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

  @UseInterceptors(AuctionsExceptionInterceptor)
  @UseInterceptors(RewardTiersExceptionInterceptor)
  @Delete("/:auctionId/tier/:rewardTierId/image")
  @ApiOperation({
    summary: "Delete image from a reward tier",
    description:
      "After calling successfully this endpoint the image value will be set to null in the DB.",
  })
  async deleteRewardTierImage(
    @Param("auctionId") auctionId: string,
    @Param("rewardTierId") rewardTierId: string,
    @Req() req
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

    //! TODO: get address via url param or userId?
    const hardcodedOwner = "0x13BBDC67f17A0C257eF67328C658950573A16aDe";

    return await this.auctionService.deleteRewardTierImage(
      hardcodedOwner,
      auctionId,
      rewardTier[0].tier
    );
  }
}
