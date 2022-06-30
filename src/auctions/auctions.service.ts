import { Inject, Injectable } from "@nestjs/common";
import {
  AUCTION_CANCELED_STATUS,
  IMAGE_ERRORS,
  IMAGE_KEYS,
  REWARD_TIER_MODIFIED_STATUS,
} from "../utils/constants";
import { IDataLayer } from "../data-layer/IDataLayer";
import { DATA_LAYER_SERVICE } from "../utils/constants";
import { AuctionDto } from "./dtos/auction.dto";
import { TierDto } from "./dtos/rewardTier.dto";
import { S3Service } from "./file-storage/file-storage.service";
import { FileSystemService } from "./file-system/file-system.service";

@Injectable()
export class AuctionsService {
  constructor(
    @Inject(DATA_LAYER_SERVICE)
    private readonly dataLayerService: IDataLayer,
    private s3Service: S3Service,
    private fileSystemService: FileSystemService
  ) {}

  async createAuction(auction: AuctionDto) {
    // ! TODO: We need to validate that this owner address matches the one sent using the JWT auth token
    const createdAuction = await this.dataLayerService.createAuction(auction);
    return {
      id: createdAuction._id,
    };
  }

  async createRewardTier(
    tier: TierDto,
    auctionId: string,
    auction: AuctionDto
  ) {
    const { depositedNfts, canceled, finalised, startDate, onChain } = auction;

    const now = new Date();
    const started = now >= startDate;

    if (started || finalised || depositedNfts || (onChain && !canceled)) {
      return { status: REWARD_TIER_MODIFIED_STATUS.notEdited };
    }
    return await this.dataLayerService.createRewardTier(tier, auctionId);
  }

  async editRewardTier(
    tier: TierDto,
    auctionId: string,
    tierId: string,
    auction: AuctionDto
  ) {
    const { depositedNfts, canceled, finalised, startDate, onChain } = auction;

    const now = new Date();
    const started = now >= startDate;

    if (started || finalised || depositedNfts || (onChain && !canceled)) {
      return { status: REWARD_TIER_MODIFIED_STATUS.notEdited };
    }

    const editedTier = await this.dataLayerService.editRewardTier(
      tier,
      auctionId,
      tierId
    );

    if (!editedTier) return;

    return editedTier;
  }

  async removeAuction(auctionId: string) {
    const auction = await this.dataLayerService.getAuction(auctionId);
    let status = AUCTION_CANCELED_STATUS.notCanceled;

    if (!auction) return;

    const { depositedNfts, canceled, onChain } = auction;

    // * check if the auction is onChain, but not canceled and that there aren't any deposited NFTs
    if (!(depositedNfts || (!canceled && onChain))) {
      await this.dataLayerService.removeAuction(auctionId);
      status = AUCTION_CANCELED_STATUS.canceled;
    }
    return {
      auctionId: auction._id,
      status,
    };
  }

  async getAuction(auctionId: string) {
    return await this.dataLayerService.getAuction(auctionId);
  }

  async removeRewardTier(
    auctionId: string,
    tierId: string,
    auction: AuctionDto
  ) {
    let status = REWARD_TIER_MODIFIED_STATUS.notDeleted;

    const { canceled, onChain, depositedNfts, finalised } = auction;

    // * check if the auction is not finalised, doesn't have any deposited NFTs, is not onChain and is not canceled
    if (!finalised || !depositedNfts || (!onChain && !canceled)) {
      const result = await this.dataLayerService.removeRewardTier(
        auctionId,
        tierId
      );
      if (!result) {
        return {
          status,
        };
      }

      status = REWARD_TIER_MODIFIED_STATUS.canceled;
    }
    return {
      status,
    };
  }

  async getAllRewardTiers(auctionId: string) {
    const rewardTiers = await this.dataLayerService.getAllRewardTiers(
      auctionId
    );
    return rewardTiers[0];
  }

  async getRewardTiersExcept(auctionId: string, tierId: string) {
    const rewardTiers = await this.dataLayerService.getRewardTiersExcept(
      auctionId,
      tierId
    );
    return rewardTiers.length ? rewardTiers[0] : [];
  }

  async getRewardTiersLength(auctionId: string) {
    const rewartTiersCount = await this.dataLayerService.getRewardTiersLength(
      auctionId
    );
    return rewartTiersCount.length ? rewartTiersCount[0].count : 0;
  }

  async getMyActiveAuctions(user: string, limit: number, offset: number) {
    return this.dataLayerService.getMyActiveAuctions(user, limit, offset);
  }

  async getMyPastAuctions(user: string, limit: number, offset: number) {
    return this.dataLayerService.getMyPastAuctions(user, limit, offset);
  }

  async getMyDraftAuctions(user: string, limit: number, offset: number) {
    return this.dataLayerService.getMyDraftAuctions(user, limit, offset);
  }

  async getMyActiveAuctionsCount(user: string) {
    return this.dataLayerService.getMyActiveAuctionsCount(user);
  }

  async getMyPastAuctionsCount(user: string) {
    return this.dataLayerService.getMyPastAuctionsCount(user);
  }

  async getMyDraftAuctionsCount(user: string) {
    return this.dataLayerService.getMyDraftAuctionsCount(user);
  }

  async editAuction(auctionId: string, auction: AuctionDto) {
    return this.dataLayerService.editAuction(auctionId, auction);
  }

  async checkUrlAvailability(owner: string, link: string) {
    const result = await this.dataLayerService.checkUrlAvailability(
      owner,
      link.trim()
    );
    if (!result) {
      return { existingPage: false };
    }

    return { existingPage: true };
  }
  private async proccessImage(
    image: Express.Multer.File | undefined,
    auction?: AuctionDto,
    rewardTier?: TierDto
  ): Promise<string | undefined> {
    if (!image) return;

    // * delete the promo image from the S3 if the user sends a new image
    if (image?.fieldname === "promo-image" && auction?.promoImageUrl) {
      await this.s3Service.deleteImage(auction.promoImageUrl.split("/").pop());
    }

    // * delete the background image from the S3 if the user sends a new image
    if (
      image?.fieldname === "background-image" &&
      auction?.backgroundImageUrl
    ) {
      await this.s3Service.deleteImage(
        auction.backgroundImageUrl.split("/").pop()
      );
    }

    // * delete the tier image from the S3 if the user sends a new image
    if (image.fieldname === "tier-image" && rewardTier?.imageUrl) {
      await this.s3Service.deleteImage(rewardTier.imageUrl.split("/").pop());
    }

    // * upload the new image to S3
    const uploadedResult = await this.s3Service.uploadDocument(
      image.path,
      `auctions/${image.filename}`,
      image.mimetype
    );

    // * remove the image from the file system
    await this.fileSystemService.removeFile(image.path);

    return uploadedResult.url;
  }

  async uploadAuctionImages(
    auction: AuctionDto,
    promoImage: Express.Multer.File | null | undefined,
    backgroundImage: Express.Multer.File | null | undefined
  ) {
    const [promoImageUrl, backgroundImageUrl] = await Promise.all([
      await this.proccessImage(promoImage, auction),
      await this.proccessImage(backgroundImage, auction),
    ]);

    return await this.dataLayerService.uploadAuctionImages(
      //@ts-ignore
      auction._id,
      promoImageUrl,
      backgroundImageUrl
    );
  }

  async checkAuctionNameAvailability(owner: string, name: string) {
    const result = await this.dataLayerService.checkAuctionNameAvailability(
      owner,
      name.trim()
    );
    if (!result) {
      return { existingName: false };
    }

    return { existingName: true };
  }

  async checkTierNameAvailability(
    owner: string,
    auctionId: string,
    name: string
  ) {
    const result = await this.dataLayerService.checkTierNameAvailability(
      owner,
      auctionId,
      name.trim()
    );

    if (!result.length) return { existingTierName: false };
    return { existingTierName: true };
  }

  async getRewardTier(auctionId: string, tierId: string) {
    return await this.dataLayerService.getRewardTier(auctionId, tierId);
  }

  async uploadRewardTierImage(
    auctionId: string,
    tierId: string,
    rewardTier: TierDto,
    image: Express.Multer.File | null | undefined
  ) {
    const rewardTierImageUrl = await this.proccessImage(
      image,
      null,
      rewardTier
    );

    rewardTier.imageUrl = rewardTierImageUrl;

    return await this.dataLayerService.uploadRewardTierImage(
      auctionId,
      tierId,
      rewardTier
    );
  }

  async deleteAuctionImages(owner: string, auction: AuctionDto, image: string) {
    let imagesToDelete: {
      promoImageUrl?: null;
      backgroundImageUrl?: null;
    } = {};

    image.split(",").forEach((image) => {
      if (image.trim() === IMAGE_KEYS.promoImage && auction?.promoImageUrl) {
        this.s3Service.deleteImage(auction.promoImageUrl.split("/").pop());
        imagesToDelete.promoImageUrl = null;
      }

      if (
        image.trim() === IMAGE_KEYS.backgroundImage &&
        auction?.backgroundImageUrl
      ) {
        this.s3Service.deleteImage(auction.backgroundImageUrl.split("/").pop());
        imagesToDelete.backgroundImageUrl = null;
      }
    });

    return this.dataLayerService.deleteAuctionImages(
      //@ts-ignore
      auction._id,
      imagesToDelete
    );
  }

  async deleteRewardTierImage(
    owner: string,
    auctionId: string,
    rewardTier: TierDto
  ) {
    if (rewardTier?.imageUrl) {
      await this.s3Service.deleteImage(rewardTier.imageUrl.split("/").pop());
    }

    return await this.dataLayerService.deleteRewardTierImage(
      auctionId,
      //@ts-ignore
      rewardTier._id
    );
  }
}
