# Avera

A WhatsApp native, non custodial crypto payment bot built on Avalanche.

Avera lets users send and receive crypto by simply chatting. No wallet apps, no complex interfaces, no long addresses.  
Just natural language like: **"Send 5 AVAX to Daniel."**

Avera handles identity, trust verification and on chain execution behind the scenes while users stay inside WhatsApp.

---

## 🚀 Features

### Core
- Send and receive Avalanche based tokens inside WhatsApp  
- Non custodial wallet creation and linking  
- Natural language payment commands  
- x402 challenge signing for sender verification  
- EIP 8004 trust proof for receiver verification  
- Balance checking and basic transaction history  

### Enhanced
- Multi token support  
- Clean WhatsApp friendly receipts  
- On chain status updates  
- Rate limiting and anti spam protection  

### Future
- Auto token swaps during payments  
- QR code payments inside WhatsApp  
- Cross chain support via LayerZero  
- Optional AI powered fraud detection  

---

## 🧩 How It Works

### 1. Start a Chat  
User opens WhatsApp and chats with the Avera bot.

### 2. Onboard  
Avera links the user’s WhatsApp identity to a non custodial wallet.

### 3. Send a Command  
Example: **"Pay John 20 USDC for the design project."**

### 4. Identity Verification  
Avera triggers an x402 challenge for the sender and generates an EIP 8004 trust proof for the receiver.

### 5. On Chain Execution  
The backend builds and broadcasts the transaction on Avalanche.

### 6. Confirmation  
Both sender and receiver get a clean receipt directly in WhatsApp.

---

## 🛠️ Architecture Overview

### Messaging Layer
- WhatsApp Business API and webhooks  
- Routes incoming messages to the backend

### Intent Engine
- Next.js API routes  
- Natural language parsing for commands and recipient resolution  

### Identity & Trust Layer
- Maps WhatsApp users to wallet addresses  
- Handles x402 signing and EIP 8004 verification proofs  

### Blockchain Layer
- Builds and broadcasts Avalanche transactions  
- Tracks confirmation status and returns results in chat  

### Data Layer
- Stores user profiles, mappings and transaction metadata  
- No private keys stored  

---

## 👥 Team

### Kenechukwu Okoye Chine  
**Role:** UI and UX Designer  
**Email:** keneochine@gmail.com  
**Telegram:** @milknicethegreat  

### Nwimo Goodluck Chioma  
**Role:** Full stack Developer  
**Email:** nwimochioma15@gmail.com  

### Okoye Emmanuel Obiajulu  
**Role:** Blockchain Developer  
**Email:** okoyeemmanuel998@gmail.com  
**Telegram:** @okoyeemmanuelobiajulu  

### Kato Lucius  
**Role:** Developer and Project Manager  
**Email:** katopaullucius@gmail.com  
**Telegram:** @katol28  

---

## 📘 One Sentence Summary

Avera lets anyone send crypto on Avalanche through simple WhatsApp messages with full trust verification and no wallet apps.

