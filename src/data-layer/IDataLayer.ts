import { AuctionDto } from "src/auctions/dtos/auction.dto";

export interface IDataLayer {
  createAuction(auction: AuctionDto);
  removeAuction(id: string);
  getAuctionById(id: string);
}
