import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertNftSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all transactions for a user
  app.get("/api/transactions/:address", async (req, res) => {
    try {
      const address = req.params.address;
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }
      
      const transactions = await storage.getTransactionsByAddress(address);
      return res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Create a new transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const transaction = insertTransactionSchema.parse(req.body);
      const createdTransaction = await storage.createTransaction(transaction);
      return res.status(201).json(createdTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      console.error("Error creating transaction:", error);
      return res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Get all NFTs for a user
  app.get("/api/nfts/:address", async (req, res) => {
    try {
      const address = req.params.address;
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }
      
      const nfts = await storage.getNftsByOwner(address);
      return res.json(nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  // Create a new NFT
  app.post("/api/nfts", async (req, res) => {
    try {
      const nft = insertNftSchema.parse(req.body);
      const createdNft = await storage.createNft(nft);
      return res.status(201).json(createdNft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid NFT data", errors: error.errors });
      }
      console.error("Error creating NFT:", error);
      return res.status(500).json({ message: "Failed to create NFT" });
    }
  });

  // Update an NFT's token URI
  app.patch("/api/nfts/:tokenId", async (req, res) => {
    try {
      const tokenId = req.params.tokenId;
      const { tokenURI } = req.body;
      
      if (!tokenId || !tokenURI) {
        return res.status(400).json({ message: "Token ID and token URI are required" });
      }
      
      const updatedNft = await storage.updateNftTokenURI(tokenId, tokenURI);
      return res.json(updatedNft);
    } catch (error) {
      console.error("Error updating NFT:", error);
      return res.status(500).json({ message: "Failed to update NFT" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
