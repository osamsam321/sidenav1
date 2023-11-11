


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, HostListener, Injectable, Input, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
// import { MarkdownService } from 'ngx-markdown';
import { FileService, TreeNode } from './FileService';
import { Observable, interval, map, of, take, timer } from 'rxjs';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { FileTypeOdi } from './FileTypeOdi';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { DataSource } from '@angular/cdk/collections';



@Component({
  selector: 'app-left-nav-bar',
  templateUrl: './left-nav-bar.component.html',
  styleUrls: ['./left-nav-bar.component.css']
})


@Injectable()
export class LeftNavBarComponent implements OnInit, AfterViewInit {

  imageUrl?: string;
  public file_type = FileTypeOdi;
  page_url:string = '';

  @Output() newFileToOpen = new EventEmitter<string>();
 
  fileNames: string[] = [];
  @Input() fullFileNodeList?: TreeNode[] = [];
  @Input() currentFileList?: TreeNode[] = [];
  public style: object = {};
  @Input() rect_width?: string;
  @Input() rect_height?: string;
  @Input() bgColor: string = 'black';
  @Input() childBackgroundColor?: string;
  @Input() file_font_family?: string;
  @Input() folder_font_family?: string;
  @Input() file_name_style!: {[key: string]: string};
  @Input() folder_name_style!: {[key: string]: string};
  @Input() rect_backgroundColor!:string;
  @Input() node_hover_background_color!:string;
  @Input() node_regular_background_color!:string;
  @Input() handlebar_right_hover_color:string = 'green';
  @Input() handbar_right_default_hover_color:string = 'transparent';
  // could be cla - Classic, viv - Vivid, sqo - Square Outline
  @Input() file_icon_default_style_option:string = 'sqo';
  @Input() file_icon_map:Map<string,string> = new Map<string, string>;
  @Input() scrollbarColor!: string; // 'blue', 'red', etc.
  @ViewChildren('add_file_icon') add_file_icon_list!: QueryList<MatIcon>;

  hoveredNode: any = null;
  handle_bar_right: string = this.handbar_right_default_hover_color;  
  isHovering = false;
  hoveredFolderNode:any = null;


  public right_edge_style: object = {};
  @ViewChild('right_edge_draggable', {static: false}) right_edge_draggable_ref?: ElementRef;
  @ViewChild('rectangle_elem', {static: false}) rectangle_elem_ref?: ElementRef;
  update_file_folder_node:any;
  nav_configured = false;
nodes: any;


  
  constructor(
    private http: HttpClient,
    // private markdownService: MarkdownService,
    private renderer: Renderer2,
    private fileService: FileService
    
  ) {

  }
  
  
  ngAfterViewInit(): void {

    console.log("width of rectangle is: " + this.rect_width)
    // this.renderer.setStyle(this.rectangle_elem_ref?.nativeElement, "width", this.rect_width);
    // this.renderer.setStyle(this.rectangle_elem_ref?.nativeElement, "height", this.rect_height);


    if(this.rectangle_elem_ref != undefined)
    {
      this.right_edge_style = {
        margin: '0px 0px 0px ' + this.rectangle_elem_ref.nativeElement.offsetWidth + 'px',
      };
    }

    this.nav_configured = true;
    
  this.update_file_folder_node = interval(500).subscribe((x =>{
    this.updateFileAndFolderNodes();
}));

  }


  ngOnInit(): void
  {
    this.get_file_tree_from_backend(); 
    console.log("values in tree: " + this.fullFileNodeList);
   
  }
  refresh_nav()
  {
    this.get_file_tree_from_backend(); 

  }
  get_file_tree_from_backend()
  {
    this.fileService.getTree().then((tree) => {
      this.fullFileNodeList = tree;
      this.dataSource.data = tree;
      this.currentFileList = tree;
    });
  }
  updateFileAndFolderNodes()
  {
  //   this.fileService.getTree().then((tree) => {
  //     this.dataSource.data = tree;
  //   });
  // 
  }
  // **************** search nav portion ********************

  search_filter(event:Event)
  {

  }

  // **************** start file transfer to parent portion ********************
 
  emitFileToParent(page_url:string){
      
    console.log("click registered");
    this.newFileToOpen.emit(page_url);
  }

  open_file(page_url:string) {
    
    console.log("need to open this page url: " + page_url);
      this.emitFileToParent(page_url);
    }


  // **************** start of angular material file tree portion  ********************


  private _transformer = (node: FileSystemNode, level: number) => {

    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      path: node.path,
      page_url:node.page_url,
      file_ext: node.file_ext,

    };
  };
  treeControl = new FlatTreeControl<FileSystemFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  hasChild = (_: number, node: FileSystemFlatNode) => node.expandable;


 

 


// **************** start of resizing portion  ********************


  validate(event: ResizeEvent): boolean {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    const MIN_WIDTH_DIMENSIONS_PX: number = (screenWidth * .10);
    const MAX_WIDTH_DIMENSIONS_PX: number = (screenWidth * .20);
    if (
    event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_WIDTH_DIMENSIONS_PX ||
      event.rectangle.width > MAX_WIDTH_DIMENSIONS_PX) 
    ) {
      return false;
    }
    return true;
  }


  onResizeEnd(event: ResizeEvent): void {
    // let left_position;
    // let width;
    // this.style = {
    //   // left: `${event.rectangle.left}px`,
    //   width: `${event.rectangle.width}px`,
    //   height: `${event.rectangle.height}px`,
    // };
    
    this.right_edge_style = {
      margin: '0px 0px 0px ' + `${event.rectangle.width}px`,
    };

    this.rect_height = event.rectangle.height + "px"
    this.rect_width = event.rectangle.width + "px"


    console.log("width: " + event.rectangle.width + " height: " + event.rectangle.height);
  }

 
}
interface FileSystemNode {
  page_url:string,
  name: string,
  isDirectory: boolean,
  file_ext:string,
  path: string,
  children: []
}

interface FileSystemFlatNode {
  page_url:string,
  expandable: boolean;
  name: string;
  level: number;
  file_ext:string,
  path: string
}

enum DefaultFileIconOption
{
  CLASSIC,
  VIVID,
  SQUARE_OUTLINE,
}