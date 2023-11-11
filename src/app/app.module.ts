import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftNavBarComponent } from './components/left-nav-bar/left-nav-bar.component';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { SecurityContext } from '@angular/core';
//import { PagesComponent } from './component/pages/pages.component';
import { FileService } from './components/left-nav-bar/FileService';
//import { mainFileService } from './component/main/MainFileService';
//import { ContDraggableComponent } from './component/cont-draggable/cont-draggable.component';
//import { ContResizableComponent } from './component/cont-resizable/cont-resizable.component';
import { ResizableModule } from 'angular-resizable-element';
//import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
//import { ExamplePdfViewerComponent } from './example-pdf-viewer/example-pdf-viewer.component';
//import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatTreeModule} from '@angular/material/tree';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { FileViewerComponent } from './component/file-viewer/file-viewer.component';
//import { MarkdownModule } from 'ngx-markdown';
//import { AngularEditorModule } from '@kolkov/angular-editor';
//import { EditorComponent } from './component/editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    LeftNavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ResizableModule,
    HttpClientModule,
    // material angular
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTreeModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
  ],
  providers: [FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
