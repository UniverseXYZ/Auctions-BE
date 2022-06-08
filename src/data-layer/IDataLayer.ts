import { AuctionDto } from "src/auctions/dtos/auction.dto";
import { NftUnavailable } from "src/availability/schemas/nft-availability.schema";

export interface IDataLayer {
  createAuction(auction: AuctionDto);
  getUnavailable(contract: string);
  setUnavailable(nfts: NftUnavailable[]);
}
