import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendMessageFormComponent } from './send-message-form/send-message-form.component';

const appRoutes: Routes = [
  { path: 'send/:token', component: SendMessageFormComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

