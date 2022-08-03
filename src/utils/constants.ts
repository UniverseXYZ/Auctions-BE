export const DATA_LAYER_SERVICE = "DATA LAYER SERVICE";

export const ETHEREUM_ADDRESS = {
  VALID: /^0x[a-fA-F0-9]{40}$/,
  INVALID_MESSAGE: "Invalid Ethereum address",
};

export const AUCTION_CANCELED_STATUS = {
  canceled: "Auction canceled successfully",
  notCanceled: "The auction cannot be canceled",
};

export const REWARD_TIER_MODIFIED_STATUS = {
  canceled: "Reward tier canceled successfully",
  notDeleted: "The reward tier cannot be deleted",
  notEdited:
    "The requirments for editing or creating a reward tier were not met",
};

export const VALID_MIME_TYPES = ["image/jpeg", "image/png"];
export const S3_ERROR =
  "AWS SDK: One or more of the following parameters is either missing or wrong: accessKeyId, secretAccessKey, s3BaseUrl, bucketName";
export const CRITICAL_ERROR = "Unhandled exception error";

export const IMAGE_KEYS = {
  promoImage: "promo-image",
  backgroundImage: "background-image",
  tierImage: "tier-image",
};

export const IMAGE_ERRORS = {
  DELETE_AUCTION_IMAGE: "Missing required query params - {image key}",
  UPLOAD_TIER_IMAGE: "Missing image file",
  UPLOAD_AUCTION_IMAGE: "Provide at least one image file",
};
