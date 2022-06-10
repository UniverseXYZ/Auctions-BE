import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IDataLayerMock } from "../../test/mocks/IDataLayer";
import { DATA_LAYER_SERVICE, notExistingAuction } from "../utils";
import { AuctionsController } from "./auctions.controller";
import { AuctionsService } from "./auctions.service";

describe("Auctions Controller", () => {
  let auctionsController: AuctionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        {
          provide: DATA_LAYER_SERVICE,
          useValue: new IDataLayerMock(),
        },
      ],
      controllers: [AuctionsController],
    }).compile();

    auctionsController = module.get<AuctionsController>(AuctionsController);
  });

  it("AuctionsController should be defined", () => {
    expect(auctionsController).toBeDefined();
  });

  it("should throw an exception", async () => {
    await expect(
      auctionsController.removeAuction("notValidId")
    ).rejects.toEqual(
      new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: notExistingAuction("notValidId"),
        },
        HttpStatus.BAD_REQUEST
      )
    );
  });
});
