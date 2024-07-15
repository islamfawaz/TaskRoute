import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionService } from './transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [TransactionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
