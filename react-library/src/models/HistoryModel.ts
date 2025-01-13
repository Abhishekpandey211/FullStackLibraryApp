// properties of the class 
class HistoryModel {
    id: number;
    userEmail: string;
    checkoutDate: string;
    returnedDate: string;
    title: string;
    author: string;
    description: string;
    img: string;


    //constructor define 
    constructor(id: number, userEmail: string, checkoutDate: string, returnedDate: string, 
        title: string, author: string, description: string, img: string) {
            this.id = id;
            this.userEmail = userEmail;
            this.checkoutDate = checkoutDate;
            this.returnedDate = returnedDate;
            this.title = title;
            this.author = author;
            this.description = description;
            this.img = img;
        }
}

export default HistoryModel;
// HistoryModel class available for use in other files.
