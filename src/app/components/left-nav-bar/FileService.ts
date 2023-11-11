import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FileService {
  constructor(private http: HttpClient) {}

  getTree(): Promise<TreeNode[]> {
    const url = 'http://localhost:4201/api/get_docs_asset_file_tree'; // Replace with your Node.js server URL
    return this.http.get<TreeNode[]>(url)
      .toPromise()
      .then((response: any) => {
        console.log(response); // Log the response data to the console
        return response as TreeNode[];
      });
  }
  

}

export interface TreeNode {
  name: string,
  isDirectory: boolean,
  file_ext:string,
  page_url:string,
  path: string,
  children: []
}
