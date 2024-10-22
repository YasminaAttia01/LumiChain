/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
 
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TransactionsProvider } from "./TransactionContext";
import { ethers } from "ethers";

const MockComponent = () => {
  const {
    connectWallet,
    currentAccount,
    transactions,
    isLoading,
    sendTransaction,
    handleChange,
    formData,
  } = React.useContext(TransactionContext);

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {currentAccount && <div>Connected Account: {currentAccount}</div>}
      {isLoading && <div>Loading...</div>}
      <input
        placeholder="Address To"
        onChange={(e) => handleChange(e, "addressTo")}
        value={formData.addressTo}
      />
      <input
        placeholder="Amount"
        onChange={(e) => handleChange(e, "amount")}
        value={formData.amount}
      />
      <button onClick={sendTransaction}>Send Transaction</button>
      {transactions.length > 0 && <div>Transactions Count: {transactions.length}</div>}
    </div>
  );
};

describe("TransactionsProvider", () => {
  beforeAll(() => {
    // Mock the Ethereum provider
    global.window.ethereum = {
      request: jest.fn(),
    };
  });

  afterAll(() => {
    delete global.window.ethereum;
  });

  it("should connect wallet and set current account", async () => {
    window.ethereum.request.mockResolvedValueOnce(["0x123"]);

    render(
      <TransactionsProvider>
        <MockComponent />
      </TransactionsProvider>
    );

    fireEvent.click(screen.getByText(/connect wallet/i));

    await waitFor(() => {
      expect(screen.getByText(/connected account:/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/connected account:/i)).toHaveTextContent("0x123");
  });

  it("should fetch transactions", async () => {
    const mockTransactions = [
      {
        receiver: "0xabc",
        sender: "0x123",
        timestamp: {
          toNumber: () => Math.floor(Date.now() / 1000),
        },
        message: "Test transaction",
        keyword: "test",
        amount: { _hex: "0x1" },
      },
    ];

    window.ethereum.request.mockResolvedValueOnce(["0x123"]);
    window.ethereum.request.mockResolvedValueOnce(mockTransactions);

    render(
      <TransactionsProvider>
        <MockComponent />
      </TransactionsProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/transactions count:/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/transactions count:/i)).toHaveTextContent("1");
  });

  it("should send a transaction", async () => {
    window.ethereum.request.mockResolvedValueOnce(["0x123"]);
    window.ethereum.request.mockResolvedValueOnce({
      hash: "0xtransactionhash",
      wait: jest.fn().mockResolvedValueOnce({}),
    });

    render(
      <TransactionsProvider>
        <MockComponent />
      </TransactionsProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/address to/i), {
      target: { value: "0xabc" },
    });
    fireEvent.change(screen.getByPlaceholderText(/amount/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText(/send transaction/i));

    await waitFor(() => {
      expect(window.ethereum.request).toHaveBeenCalled();
    });

    expect(window.ethereum.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "eth_sendTransaction",
      })
    );
  });

  it("should alert if MetaMask is not installed", async () => {
    delete window.ethereum;

    const originalAlert = window.alert;
    window.alert = jest.fn();

    render(
      <TransactionsProvider>
        <MockComponent />
      </TransactionsProvider>
    );

    fireEvent.click(screen.getByText(/connect wallet/i));

    expect(window.alert).toHaveBeenCalledWith("Please install MetaMask.");
    
    window.alert = originalAlert; // Restore the original alert
  });
});
