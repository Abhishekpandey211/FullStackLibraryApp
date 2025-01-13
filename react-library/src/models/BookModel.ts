import { strict } from "assert";


// properties of the class 
class BookModel {
    id: number;
    title: string;
    author? : string;
    description? : string;
    copies? : number;
    copiesAvailable? : number;
    category? : string;
    img? : string;


    // define constructor 
    constructor (id: number, title: string, author: string, description: string, 
        copies: number, copiesAvailable: number, category: string, img: string) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.description = description;
            this.copies = copies;
            this.copiesAvailable = copiesAvailable;
            this.category = category;
            this.img = img;

    }
}
export default BookModel;
// BookModel class available for use in other files.