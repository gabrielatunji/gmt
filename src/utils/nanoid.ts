import {customAlphabet} from 'nanoid'; 


const alphabet = '0123456789';
const generatePostID = customAlphabet(alphabet, 4); 


export default generatePostID;

