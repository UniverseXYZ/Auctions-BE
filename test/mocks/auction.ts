export const mockAuction = {
  owner: "0x13BBDC67f17A0C257eF67328C658950573A16aDe",
  name: "Auction1",
  tokenAddress: "0x0000000000000000000000000000000",
  tokenSymbol: "XYZ",
  tokenDecimals: 18,
  startDate: new Date(),
  endDate: new Date(),
  royaltySplits: [
    {
      address: "0x0000000000000000000000000000",
      percentAmount: 10,
    },
  ],
  rewardTiers: [
    {
      name: "Reward tier 1",
      numberOfWinners: 3,
      nftsPerWinner: "1-3",
      nftSlots: [
        {
          nfts: [
            {
              contractAddress: "0xb67E6711C3bB2AA968bE26703dE20152d4948b38",
              nftId: 1,
              claimed: false,
            },
          ],
          minimumBid: 0.1,
          capturedRevenue: false,
        },
        {
          nfts: [
            {
              contractAddress: "0xb67E6711C3bB2AA968bE26703dE20152d4948b38",
              nftId: 1,
              claimed: false,
            },
          ],
          minimumBid: 0.1,
          capturedRevenue: false,
        },
        {
          nfts: [
            {
              contractAddress: "0xb67E6711C3bB2AA968bE26703dE20152d4948b38",
              nftId: 1,
              claimed: false,
            },
          ],
          minimumBid: 0.1,
          capturedRevenue: false,
        },
      ],
    },
  ],
};
