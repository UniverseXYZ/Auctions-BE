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
