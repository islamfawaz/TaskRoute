import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TransactionService } from '../transaction.service';
import { ProcessedTransaction } from '../processed-transaction';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  customers: any[] = [];
  transactions: any[] = [];
  processedTransactions: ProcessedTransaction[] = [];
  filterName: string = '';
  filterAmount: number = 0;
  chart: any;

  constructor(private _TransactionService: TransactionService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this._TransactionService.getTransactions().subscribe(response => {
      console.log(response);
      this.customers = response.record.customers;
      this.transactions = response.record.transactions;

      this.transactions.sort((a, b) => a.customer_id - b.customer_id);

      this.processedTransactions = this.processTransactions(this.customers, this.transactions);
    });
  }

  processTransactions(customers: any[], transactions: any[]): ProcessedTransaction[] {
    return customers.map(customer => {
      const customerTransactions = this.binarySearchTransactions(transactions, customer.id);
      const totalTransactionAmount = customerTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      const uniqueDates = [...new Set(customerTransactions.map(transaction => transaction.date))];
      const transactionsPerDay = uniqueDates.length;

      return {
        name: customer.name,
        totalTransactionAmount,
        transactionsPerDay
      };
    });
  }

  binarySearchTransactions(transactions: any[], customerId: number): any[] {
    let start = 0;
    let end = transactions.length - 1;
    let mid: number;

    while (start <= end) {
      mid = Math.floor((start + end) / 2);
      if (transactions[mid].customer_id < customerId) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    let startIndex = start;
    const result = [];

    while (startIndex < transactions.length && transactions[startIndex].customer_id === customerId) {
      result.push(transactions[startIndex]);
      startIndex++;
    }

    return result;
  }

  filterTransactions() {
    return this.processedTransactions.filter(transaction => {
      return (this.filterName ? transaction.name.toLowerCase().includes(this.filterName.toLowerCase()) : true) &&
             (this.filterAmount ? transaction.totalTransactionAmount >= this.filterAmount : true);
    });
  }

  showChart(customer: ProcessedTransaction) {
    const customerData = this.customers.find(cust => cust.name === customer.name);
    if (!customerData) return;

    const customerId = customerData.id;
    const customerTransactions = this.binarySearchTransactions(this.transactions, customerId);

    const dates = customerTransactions.map(transaction => transaction.date);
    const amounts = customerTransactions.map(transaction => transaction.amount);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Transaction Amount',
          data: amounts,
          borderWidth: 3,
          fill: false
        }]
      }
    });
  }
}
