import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
// import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { PathComponent } from './path/path.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: 'add',
    component : HomeComponent
  },
  // {
  //   path: 'edit', 
  //   component: EditComponent,
  // },
  {
    path: 'list', 
    component: ListComponent,
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    // EditComponent,
    ListComponent,
    PathComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [
    PathComponent
  ]
})
export class AppModule{ 
 }

 

