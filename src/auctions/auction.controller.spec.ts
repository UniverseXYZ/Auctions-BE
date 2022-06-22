import { APP_FILTER } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { IDataLayerMock } from "../../test/mocks/IDataLayer";
import { NftsService } from "../nfts/nfts.service";
import { DATA_LAYER_SERVICE } from "../utils/constants";
import { AuctionsController } from "./auctions.controller";
import { AuctionsService } from "./auctions.service";
import { ExceptionsFilter } from "../errors/exceptions.filter";
import { HttpService } from "@nestjs/axios";

describe("Auctions Controller", () => {
  let auctionsController: AuctionsController;
  let auctionsService: AuctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        NftsService,
        HttpService,
        {
          provide: DATA_LAYER_SERVICE,
          useValue: new IDataLayerMock(),
        },
      ],
      controllers: [AuctionsController],
    }).compile();

    auctionsController = module.get<AuctionsController>(AuctionsController);
    auctionsService = module.get<AuctionsService>(AuctionsService);
  });

  it("AuctionsController should be defined", () => {
    expect(auctionsController).toBeDefined();
  });
});
