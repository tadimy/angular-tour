/**
 * Created by Angular2 on 15-11-8.
 */
export declare class AngularPress {
    asArray():WPPostArray;
}
export interface WPPostArray {
    getItem(post_id:number): any;
}