//TODO: separate errors, functions etc

import mongoose from "mongoose";

export const DATA_LAYER_SERVICE = "DATA LAYER SERVICE";

export const ETHEREUM_ADDRESS = {
  VALID: /^0x[a-fA-F0-9]{40}$/,
  INVALID_MESSAGE: "Invalid Ethereum address",
};

export const notExistingAuction = (id: string) =>
  `Auction id '${id}' does not exist`;
export const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);
