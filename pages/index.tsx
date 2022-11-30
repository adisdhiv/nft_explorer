import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useAccount } from 'wagmi';
import styles from '../styles/Home.module.css';
import { Network, Alchemy } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Grid } from '@mui/material';

const Home: NextPage = () => {

  const { address, isConnected } = useAccount()
  const [nfts, setNfts] : any = useState()

  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };

  console.log(address)

  const alchemy = new Alchemy(settings);

  useEffect(() => {
    if (isConnected && address){
      fetchNFTs(address);
    }}, [])

  async function fetchNFTs(address:any) {
    // Get all NFTs
    const nfts = await alchemy.nft.getNftsForOwner(address);
    // Print NFTs
    setNfts(nfts.ownedNfts);
    console.log(nfts);
  }

  function processImages(image: any){
    console.log(image)
    const image_params = image.image;
    if (image_params.includes("ipfs"))
      return image_params.replace("ipfs://", "https://ipfs.io/ipfs/")
    return image_params;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ConnectButton/>
        <Grid container spacing={2}>
          {nfts?.map((nft: any, index : any) => {
        return (
          <Card key={index} className={styles.card}>
            {nft.tokenUri.raw}
            <br></br>
            <img className={styles.image} src= {processImages(nft.rawMetadata)}/>
            <br></br>
            {nft.title}
            <br></br>
            {nft.tokenType}
          </Card>
        );
      })}
      </Grid>
      </main>
    </div>
  );
};

export default Home;

